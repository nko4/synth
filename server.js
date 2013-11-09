// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('1Te9Gvwfrmm8qZKH');

var isProduction = (process.env.NODE_ENV === 'production'),
    http = require('http'),
    express = require('express'),
    io = require('socket.io'),
    port = (isProduction ? 80 : 8000);


var app = express(), 
    server = http.createServer(app), 
    io = io.listen(server);

server.listen(port);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

console.log('Server running at http://0.0.0.0:' + port + '/');