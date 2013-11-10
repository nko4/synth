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
	var self = this;
    self.gameCollection.remove({
    				createdBy: {
    					$in: [userId]
    				}
    			}, function(err) {
    				if(err) throw err;
					self.userCollection.remove({userId: userId}, function(err, results) {
						if(err) throw err;
						callback(results);
					});	
	});	
};

Store.prototype.getGameCreatedByUser = function(userId, callback) {
    this.gameCollection.find({
    				createdBy: {
    					$in: [userId]
    				}
    			}).toArray(function(err, results) {
					if(err) throw err;
					callback(results.length ? results[0] : undefined);
	});
};

Store.prototype.getGamesReadyToPlay = function(userId, callback) {
    this.gameCollection.find({
    				joinedBy: {
    					$exists: false
    				}, 
    				createdBy: {
    					$ne: userId
    				}
    			}).toArray(function(err, results) {
					if(err) throw err;
					callback(results);
	});
};

Store.prototype.getGamesBeingPlayed = function(callback) {
    this.gameCollection.find({joinedBy: {$exists: true}}).toArray(function(err, results) {
		if(err) throw err;
		callback(results);
	});
};

Store.prototype.createGame = function(gameId, user, callback) {
	var game = {
		gameId: gameId,
		createdBy: user.userId,
		createdByName: user.name,
		joinedByName: ''
	};
	this.gameCollection.insert(game, function(err, results) {
		if(err) {
			throw err;
		}
		callback(results[0]);
	});
};

Store.prototype.joinGame = function(gameId, user, callback) {
	var self = this;
	self.gameCollection.update({gameId: gameId}, {$set: {joinedBy: user.userId, joinedByName: user.name}}, function(err) {
		if(err) {
			throw err;
		}
		self.gameCollection.find({gameId: gameId}).toArray(function(err, results) {
			if(err) throw err;
			callback(results.length ? results[0] : undefined);
		});	
	});
};

Store.prototype.deleteAll = function(callback) {
	var self = this;
	self.gameCollection.remove(function(err) {
		if(err) {
			throw err;
		}
		self.userCollection.remove(function(err) {
			if(err) {
				throw err;
			}
			callback();
		});
	});
};

Store.prototype.setSocketForUser = function(socketId, userId) {
	this.userCollection.update({userId: userId}, {$set: {socketId: socketId }}, function(err) {
		if(err) {
			throw err;
		}
		console.dir("updated socketId for User: " + userId);
	});
};

Store.prototype.getSocketForUser = function(userId, callback) {
	this.userCollection.find({userId: userId}).toArray(function(err, results) {
		if(err) throw err;
		var socketId;
		if(results.length && results[0].socketId) {
			socketId = results[0].socketId;
		}
		callback(socketId);	
	});
};

module.exports = Store;