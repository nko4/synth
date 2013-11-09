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

Store.prototype.getGames = function(callback) {
	return this.redis.lrange('games', 0, -1, function(err, data) {
		if(err) {
			throw err;
		}
		callback(data);
	});
};

Store.prototype.deleteUser = function(userId) {
	this.redis.del(userId);
};

Store.prototype.info = function() {
	return this.redis.server_info;
};

module.exports = Store;

//this.redis.lpush('games', 'samm');