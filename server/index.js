module.exports = function(store) {

    var isProduction = (process.env.NODE_ENV === 'production'),
        http = require('http'),
        express = require('express'),
        io = require('socket.io'),
        port = (isProduction ? 80 : 8000),
        dust = require('dustjs-linkedin'),
        cons = require('consolidate'),
        meta = require('../meta'),
        uuid = require('node-uuid'),
        sockets = require('./sockets'),
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

    app.engine('dust', cons.dust);
    app.set('views', './server/templates');
    app.set('view engine', 'dust');

    app.get('/', function(req, res, next) {
        res.render('master');
    });

    app.get('/user', user.get);
    app.post('/user', user.post);    

    app.get('/games/ready', function(req, res) {
        var userId = req.cookies[meta.userId];
        store.getGamesReadyToPlay(userId, function(games) {
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
        store.createGame(gameId, userId, function(game) {
            res.json(200, game);
        });
    });  

    app.post('/game/join/:gameId', function(req, res) {
        //TODO: handle unauth users
        var userId = req.cookies[meta.userId];
        store.joinGame(req.params.gameId, userId, function(game) {
            res.json(200, game);
        });
    });    

    app.get('/clear', function(req, res) {
        res.clearCookie(meta.userId);
        store.deleteUser(req.cookies[meta.userId], function() {
            res.redirect('/');
        });
    });

    app.get('/banish', function(req, res) {
        store.deleteAll(function() {
            res.redirect('/');
        });
    });    


    sockets.setup(io, store);
    server.listen(port);

    console.log('Server running at http://0.0.0.0:' + port + '/');

};