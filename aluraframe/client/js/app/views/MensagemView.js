class MensagemView extends View{
    constructor(elemento){
        super(elemento);
    }
    template(model){
        return `<p class="alert-success w-50 p-3"> ${model.texto} </p>`;        
    }
 
}