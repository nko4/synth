module.exports = function(store) {

    var isProduction = (process.env.NODE_ENV === 'production'),
        http = require('http'),
        express = require('express'),
        io = require('socket.io'),
        port = (isProduction ? 80 : 8000),
        uuid = require('node-uuid'),
        meta = require('../meta');


    var app = express(), 
        server = http.createServer(app), 
        io = io.listen(server);


    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.logger());
    app.use(express.static('./public'));
    app.use(app.router);

    app.set('view engine', 'jade');
    app.set('views', './public/views');

    app.get('/user', function(req, res) {
        var userId = req.cookies[meta.userId];
        store.getUser(userId, function(name) {
            if(name) {
                res.json(200, {
                    name: name
                });
            }
            else {
                res.clearCookie(meta.userId);
                res.json(404, {
                    error: "user not found"
                });
            }
        });
    });

    app.post('/user', function(req, res) {
        var userId = req.cookies[meta.userId];
        store.getUser(userId, function(name) {
            if(name) {
                res.json(400, {
                    error: "user already exists, clear out the current user"
                });
            }
            else {
                var name = req.body.name;
                if(name) {
                    var userId = uuid.v4();
                    res.cookie(meta.userId, userId);
                    store.setUser(userId, name);
                    res.json(200, {});
                }
                else {
                    res.json(400, {
                        error: "please send a name in the post body"
                    });
                }
            }
        });
    });    

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