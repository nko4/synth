var isProduction = (process.env.NODE_ENV === 'production'),
    http = require('http'),
    express = require('express'),
    io = require('socket.io'),
    port = (isProduction ? 80 : 8000),
    uuid = require('node-uuid'),
    meta = require('./meta'),
    nko = require('nko')('1Te9Gvwfrmm8qZKH');


var app = express(), 
    server = http.createServer(app), 
    io = io.listen(server);

app.use(express.cookieParser());
app.use(express.logger());
app.use(express.static(__dirname + '/public'));
app.use(app.router);


app.get('/', function(req, res) {
  if(req.cookies[meta.userId]) {
    res.send("userId cookie found: " + req.cookies[meta.userId]);
  }
  else {
    res.cookie(meta.userId, uuid.v4(), { maxAge: 90000000, httpOnly: false});
    res.send("userId cookie not found: just set a new one");
  }
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

app.get('/', function(req, res) {
  var gameid = req.cookies.gameid;
  
  res.send('gameid: ' + gameid);
  console.log('gameid: ' + gameid);
});

app.get('/createGame', function(req, res) {
  // create game id and store 
  res.cookie('gameid', req.cookies.gameid+1 || 5000 );
});

app.get('/join', function(req, res) {
  res.send('join game');
});

server.listen(port);
console.log('Server running at http://0.0.0.0:' + port + '/');