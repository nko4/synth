var redis = require("redis").createClient(),
    webserver = require("./server/index"),
    Store = require("./server/store"),
    nko = require('nko')('1Te9Gvwfrmm8qZKH');


// TODO: if redis fails, then dont start 
// the app but give a message atleast!
redis.on("error", function (err) {
  console.log("Redis Error " + err);
});


redis.on("ready", function() {
    webserver(new Store(redis));
});

//redis.quit();
