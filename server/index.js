module.exports = function(store) {

    var isProduction = (process.env.NODE_ENV === 'production'),
        http = require('http'),
        express = require('express'),
        io = require('socket.io'),
        port = (isProduction ? 80 : 8000),
        meta = require('../meta'),
        user = require('./user');


    var app = express(), 
        server = http.createServer(app), 
        io = io.listen(server);


    app.use(function(req, res, next) {
        req.store = store;
        next();
    });          

    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.logger());
    app.use(express.static('./public'));
    app.use(app.router);

    app.set('view engine', 'jade');
    app.set('views', './public/views');


    app.get('/user', user.get);
    app.post('/user', user.post);    

    app.get('/create', function(req, res) {
        // create user id and store 
        ;
        res.send("just set a new cookie");
    });

    app.get('/join', function(req, res) {
        res.send('join game');
    });

    app.get('/clear', function(req, res) {
        res.clearCookie(meta.userId);
        store.deleteUser(req.cookies[meta.userId]);
        res.redirect('/');
    });

    io.sockets.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });

    server.listen(port);
    console.log('Server running at http://0.0.0.0:' + port + '/');

};