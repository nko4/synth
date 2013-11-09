var mongoClient = require('mongodb').MongoClient,
    webserver = require("./server/index"),
    Store = require("./server/store"),
    nko = require('nko')('1Te9Gvwfrmm8qZKH');


mongoClient.connect('mongodb://127.0.0.1:27017/synth', function(err, db) {
	if(err) throw err;

	webserver(new Store(db));


	process.on("exit", function() {
		db.close();
	});

});
