var cookie = require('cookie'),
	meta = require('./meta');

exports.setup = function(io, store) {
    io.sockets.on('connection', function (socket) {
        if(socket.handshake.headers.cookie) {
            var userId = cookie.parse(socket.handshake.headers.cookie)[meta.userId];
            if(userId) {
                store.setSocketForUser(socket.id, userId); 
                socket.emit("registeredUser", {}); 
            }
        }  
    });	
};

exports.broadCastNewGame = function(io, game) {
    io.sockets.emit("newGame", game);
};