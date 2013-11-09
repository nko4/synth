var Store = function(redis) {

	this.redis = redis;
};

Store.prototype.setUser = function(userId, name) {
	this.redis.set(userId, name);
};

Store.prototype.getUser = function(userId, callback) {
	this.redis.get(userId, function(err, reply) {
		if(err) {
			throw err;
		}
		callback(reply);
	});
};

Store.prototype.deleteUser = function(userId) {
	this.redis.del(userId);
};

Store.prototype.info = function() {
	return this.redis.server_info;
};

module.exports = Store;