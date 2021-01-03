var http = require('http')
    ,app = require('./config/express');

http.createServer(app).listen(3000, function() {
    console.log('Servidor estudando na porta: ' + this.address().port);
});

