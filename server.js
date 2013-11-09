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