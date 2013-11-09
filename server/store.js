var Store = function(redis) {

	this.redis = redis;
};

Store.prototype.info = function() {
	return this.redis.server_info;
};

module.exports = Store;