process.chdir(__dirname);

var nko = require('nko')('1Te9Gvwfrmm8qZKH');

var mongoClient = require('mongodb').MongoClient,
    Store = require("./store");

WebServer = function(store) {

    var isProduction = (process.env.NODE_ENV === 'production'),
        http = require('http'),
        express = require('express'),
        io = require('socket.io'),
        port = (isProduction ? 80 : 8000),
        dust = require('dustjs-linkedin'),
        cons = require('consolidate'),
        meta = require('./meta'),
        uuid = require('node-uuid'),
        sockets = require('./sockets'),
        Play = require('./play'),
        user = require('./user');

    var app = express(), 
        server = http.createServer(app);

    
    app.use(function(req, res, next) {
        req.store = store;
        //TODO: handle unauth users
        next();
    });          

    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.logger());
    app.use(express.static('./public'));
    app.use(app.router);

    app.engine('dust', cons.dust);
    app.set('views', './templates');
    app.set('view engine', 'dust');

    app.get('/', function(req, res, next) {
        res.render('master');
    });

    app.get('/user', user.get);
    app.post('/user', user.post);    

    app.get('/games/ready', function(req, res) {
        var userId = req.cookies[meta.userId];
        store.getGamesReadyToPlay(userId, function(games) {
            store.getGameCreatedByUser(userId, function(game) {
                res.json(200, {
                    games: games,
                    userCreatedGame: game
                });
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
        var gameId = uuid.v1();
        var userId = req.cookies[meta.userId];
        store.getUser(userId, function(user) {
            store.createGame(gameId, user, function(game) {
                sockets.broadCastNewGame(io, game);
                res.json(200, game);
            });
        });
        
    });  

    app.post('/game/join/:gameId', function(req, res) {
        var userId = req.cookies[meta.userId];
        store.getUser(userId, function(user) {
            store.joinGame(req.params.gameId, user, function(game) {
                if(game) {
                    var play = new Play(game, store, io);
                    play.start();
                    res.json(200, {
                        gameId: req.params.gameId
                    });
                }
                else {
                    res.json(404, {
                        error: "game not found"
                    });                    
                }
            });
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

    server.listen(port);
    io = io.listen(server);
    sockets.setup(io, store);
    io.set('log level', 1);
    console.log('Server running at http://0.0.0.0:' + port + '/');
};


// if run as root, downgrade to the owner of this file
if (process.getuid() === 0) {
	require('fs').stat(__filename, function(err, stats) {
		if (err) { return console.error(err); }
		process.setuid(stats.uid);
	});
}    


mongoClient.connect('mongodb://localhost:27017/synth', function(err, db) {
	if(err) throw err;

	WebServer(new Store(db));


	process.on("exit", function() {
		db.close();
	});

});
