module.exports = function(store) {

    var isProduction = (process.env.NODE_ENV === 'production'),
        http = require('http'),
        express = require('express'),
        io = require('socket.io'),
        port = (isProduction ? 80 : 8000),
        uuid = require('node-uuid'),
        engines = require('consolidate'),
        meta = require('../meta'),
        uuid = require('node-uuid'),
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

    app.engine('dust', engines.dust);
    app.set('views', './public/views');
    app.set('view engine', 'dust');

    app.get('/user', user.get);
    app.post('/user', user.post);    

    app.get('/games/ready', function(req, res) {
        store.getGamesReadyToPlay(function(games) {
            res.json(200, {
                games: games
            });
        });
    });

    app.get('/games/started', function(req, res) {
        store.getGamesBeingPlayed(function(games) {
            res.json(200, {
                games: games
            });
        });
    });    

    app.post('/game/start', function(req, res) {
        //TODO: handle unauth users
        var gameId = uuid.v1();
        var userId = req.cookies[meta.userId];
        store.createGame(gameId, userId, function() {
            res.json(200, {});
        });
    });  

    app.post('/game/join/:gameId', function(req, res) {
        //TODO: handle unauth users
        var userId = req.cookies[meta.userId];
        store.joinGame(req.params.gameId, userId, function() {
            res.json(200, {});
        });
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