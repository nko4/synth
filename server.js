<<<<<<< HEAD
var isProduction = (process.env.NODE_ENV === 'production'),
    http = require('http'),
    express = require('express'),
    io = require('socket.io'),
    port = (isProduction ? 80 : 8000),
    uuid = require('node-uuid'),
    meta = require('./meta'),
    nko = require('nko')('1Te9Gvwfrmm8qZKH'),
    dust = require('express-dust/lib/dust');
;


var app = express(), 
    server = http.createServer(app),
    io = io.listen(server);

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.logger());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);

  // assign the dust engine to .dust files
 // app.engine('dust', cons.dust);
  app.set('view engine', 'dust');
  app.set('views', __dirname + '/public/views');
});

app.get('/', function(req, res, next) {
  //retrieve user id
  var userId = req.cookies[meta.userId] || 0;
  if(req.cookies[meta.userId]) {
    res.send("userId cookie found: " + req.cookies[meta.userId]);
  }

  res.render('index', {
    userId: userId
  });

  // if found dont display form
  // else display form
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

var redis = require("redis").createClient(),
    webserver = require("./server/index"),
    nko = require('nko')('1Te9Gvwfrmm8qZKH');


redis.on("error", function (err) {
  console.log("Redis Error " + err);
});

redis.on("ready", function() {
    webserver();
});

//redis.quit();
