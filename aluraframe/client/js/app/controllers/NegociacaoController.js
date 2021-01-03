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

        Object.freeze(this);

    }
    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value
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
        this._listaNegociacoes.adiciona(this._criaNegociacao());
        this._mensagem.texto = 'Negociação realizada com sucesso!';             
        this._limpaFormulario();
        console.log(this._listaNegociacoes.negociacao);
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
                .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                this._mensagem.texto = 'Negociação da semana importada com sucesso';
            })
            .catch( error => this._mensagem.texto = error )        
    }

    apagaNegociacao() {
        this._listaNegociacoes.esvazia();
        this._mensagem.texto = 'Lista de Negociações Apagada com Sucesso';
        //this._mensagemView.update(this._mensagem);
    }


}