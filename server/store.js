var Store = function(db) {

	this.db = db;
	this.userCollection = db.collection("users");
	this.gameCollection = db.collection("games");
};

Store.prototype.setUser = function(userId, name, callback) {
	var user = {
		userId: userId,
		name: name
	};
	this.userCollection.insert(user, function (err, inserted) {
		if(err) throw err;
		callback();
	});
};

Store.prototype.getUser = function(userId, callback) {
	this.userCollection.find({userId: userId}).toArray(function(err, results) {
		if(err) throw err;
		callback(results.length ? results[0] : undefined);
	});
};

Store.prototype.deleteUser = function(userId, callback) {
	this.userCollection.remove({userId: userId}, function(err, results) {
		if(err) throw err;
		callback(results);
	});
};









Store.prototype.getGamesReadyToPlay = function(callback) {
    this.redis.hvals('games', function (err, data) {
    	if(err) {
    		throw err;
    	}
    	var gamesWithoutJoinedBy = data.map(JSON.parse).filter(function(game) {
    		return !game.joined_by;
    	});
        callback(gamesWithoutJoinedBy);
    });	
};

Store.prototype.getGamesBeingPlayed = function(callback) {
    this.redis.hvals('games', function (err, data) {
    	if(err) {
    		throw err;
    	}
    	var gamesWithJoinedBy = data.map(JSON.parse).filter(function(game) {
    		return !!game.joined_by;
    	});
        callback(gamesWithJoinedBy);
    });	
};

Store.prototype.createGame = function(gameId, userId, callback) {
	var game = {
		id: gameId,
		created_by: userId
	};

	this.redis.hset('games', game.id, JSON.stringify(game), function(err) {
		if(err) {
			throw err;
		}
		callback();
	});
};

Store.prototype.joinGame = function(gameId, userId, callback) {
	var self = this;
	this.redis.hget('games', gameId, function(err, data) {
		if(err) {
			throw err;
		}
		var game = JSON.parse(data);
		game.joined_by = userId;
		self.redis.hset('games', game.id, JSON.stringify(game), function(err, reply) {
			if(err) {
				throw err;
			}
			callback(reply);
		});
	});
};

Store.prototype.info = function() {
	return this.redis.server_info;
};

module.exports = Store;