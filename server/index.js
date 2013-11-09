module.exports = function(store) {

    var isProduction = (process.env.NODE_ENV === 'production'),
        http = require('http'),
        express = require('express'),
        io = require('socket.io'),
        port = (isProduction ? 80 : 8000),
        uuid = require('node-uuid'),
        engines = require('consolidate'),
        meta = require('../meta');


    var app = express(), 
        server = http.createServer(app), 
        io = io.listen(server);

    
    app.use(express.cookieParser());
    app.use(express.logger());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);

    app.engine('dust', engines.dust);
    app.set('views', './public/views');
    app.set('view engine', 'dust');


    app.get('/', function(req, res, next) {
        //retrieve user id
        var userId = req.cookies[meta.userId] || 0;

        res.render('index', {
            userId: userId
        });
    });

    app.get('/create', function(req, res) {
        // create user id and store 
        res.cookie(meta.userId, uuid.v4());
        res.send("just set a new cookie");
    });

    app.get('/join', function(req, res) {
        res.send('join game');
    });

    app.get('/clear', function(req, res) {
        res.clearCookie(meta.userId); 
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