var Store = function(redis) {

	this.redis = redis;
};

Store.prototype.setUser = function(userId, name) {
	this.redis.set(userId, name);
};

Store.prototype.getUser = function(userId, callback) {
	this.redis.get(userId, function(err, data) {
		if(err) {
			throw err;
		}
		callback(data);
	});
};

Store.prototype.deleteUser = function(userId) {
	this.redis.del(userId);
};

Store.prototype.getGames = function(callback) {
    this.redis.hvals('games', function (err, data) {
    	if(err) {
    		throw err;
    	}
        callback(data.map(JSON.parse));
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

//this.redis.lpush('games', 'samm');