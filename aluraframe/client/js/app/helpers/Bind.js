// Usando o Rest operator  (...) para substituir array na instância

class Bind{
    constructor(model,view, ...props){
        let proxy = ProxyFactory.create(model,props,model=>view.update(model));
        view.update(model);
        return proxy;
    }
}