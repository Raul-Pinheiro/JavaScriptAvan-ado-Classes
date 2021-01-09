var ConnectionFactory = (function () {
    const stores = ['negociacoes'];
    const version = 7;
    const dbName = 'aluraframe';
    var connection = null;
    var close = null;

    return class ConnectionFactory {

        constructor() {
            throw new Error('Não é permitido instanciar esse objeto')
        }

        static getConnection() {
            return new Promise((resolve, reject) => {
                let openRequest = window.indexedDB.open(dbName, version);

                openRequest.onupgradeneeded = e => {

                    ConnectionFactory._createStores(e.target.result);

                }
                openRequest.onsuccess = e => {
                    if (!connection) {
                        connection = e.target.result;
                        close = connection.close.bind(connection);
                        connection.close = function () {
                            throw new Error('Você não pode fechar diretamente uma conexão');
                        }

                    }
                    resolve(connection);

                }
                openRequest.onerror = e => {
                    console.log(e.target.error);
                    reject(e.target.error.name);
                }
            })

        }

        static _createStores(con) {
            stores.forEach(store => {
                if (con.objectStoreNames.contains(store)) {
                    con.deleteObjectStore(store);
                }
                con.createObjectStore(store, { autoIncrement: true });
            });
        }

        static closeConnection() {
            if (connection) {
                close();
                connection = null;
            }
        }
    }
})();

