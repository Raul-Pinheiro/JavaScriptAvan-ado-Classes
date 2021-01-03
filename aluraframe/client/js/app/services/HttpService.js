class HttpService{
    get(url){
        return new Promise((resolve,reject)=>{
            let xhr = new XMLHttpRequest();

            xhr.open('GET', url);
            //Configurações importantes
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        console.log('Obtendo as negociações do servidor')
                        resolve(JSON.parse(xhr.responseText))
                        //.map(obj => new Negociacao(new Date(obj.data), obj.quantidade, obj.valor)));
                        //.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                    }else{
                        reject(xhr.responseText);
    
                    }
                
                }
            }
    
            xhr.send();
        });
    }
}
    