var io,
	store,
	cookie = require('cookie'),
	meta = require('../meta');

exports.setup = function(io, store) {
	io = io;
	store = store;

    io.sockets.on('connection', function (socket) {
        if(socket.handshake.headers.cookie) {
            var userId = cookie.parse(socket.handshake.headers.cookie)[meta.userId];
            store.setSocketForUser(socket.id, userId);        
        }  
    });	
};
    
