class NegociacaoController {
    constructor() {
        let $ = document.querySelector.bind(document);

        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        // Proxy, Factory e Bind
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacaoView($('#negociacaoView')),
            'adiciona', 'esvazia',
        );
  
        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto'
        )     

        ConnectionFactory
            .getConnection()
            .then(connection => {
                new NegociacaoDao(connection)
                    .listaNegociacoesDao()
                    .then(negociacoes => {
                        negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                    })
            })
            .catch(error => {
                console.log(error);
                this._mensagem.texto='Não foi possível obter as negociações';
            })

        
        // setInterval(()=>{
        //     this.importaNegociacoes();        
        // },3000);

    }

    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );

    }

    _limpaFormulario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0;
        this._inputData.focus();

    }

    adicionaNegociacao(event) {

        event.preventDefault();

        ConnectionFactory
            .getConnection()
            .then(connection => {
                var negociacao = this._criaNegociacao()

                new NegociacaoDao(connection)
                    .adiciona(negociacao)
                    .then(() => {
                        this._listaNegociacoes.adiciona(negociacao);
                        this._mensagem.texto = 'Negociação realizada com sucesso!';             
                        this._limpaFormulario();
                    })
            })
            .catch( erro => this._mensagem.texto = erro);       
        
    }

    //Requisicao AJAX

    importaNegociacoes() {

        let service = new NegociacaoService();

   

        let promise = service.obterNegociacoesDaSemana();
        let promise2 = service.obterNegociacoesDaSemanaAnterior();
        let promise3 = service.obterNegociacoesDaSemanaRetrasada();

        Promise.all([
            promise,
            promise2,
            promise3]
            )
            .then(negociacoes =>{
                negociacoes
                .reduce((arrayAchatado,array)  => arrayAchatado.concat(array),[])
                .forEach(negociacao =>{
                    if(this._listaNegociacoes.negociacoes.some(ngc => ngc == JSON.stringify(negociacao))){
                        return;
                    }
                    this._listaNegociacoes.adiciona(negociacao);
                } 
                );
                this._mensagem.texto = 'Negociação da semana importada com sucesso';
            })
            .catch( error => this._mensagem.texto = error )        
    }

    apagaNegociacao() {


        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
        });   

        
    }


}