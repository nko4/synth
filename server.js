process.chdir(__dirname);

var nko = require('nko')('1Te9Gvwfrmm8qZKH');

var mongoClient = require('mongodb').MongoClient,
    webserver = require("./server/index"),
    Store = require("./server/store");


// if run as root, downgrade to the owner of this file
if (process.getuid() === 0) {
	require('fs').stat(__filename, function(err, stats) {
		if (err) { return console.error(err); }
		process.setuid(stats.uid);
	});
}    


mongoClient.connect('mongodb://localhost:27017/synth', function(err, db) {
	if(err) throw err;

	webserver(new Store(db));


	process.on("exit", function() {
		db.close();
	});

});
