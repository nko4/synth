var Play;

Play = function(game, store, io) {
	this.game = game;
	this.store = store;
	this.io = io;

	this.playerA;
	this.playerB;
};

Play.prototype.start = function() {
	var self = this;
	self.store.getSocketForUser(self.game.createdBy, function(socketId) {		
		self.playerA = {
			userId: self.game.createdBy,
			socketId: socketId
		};

		self.store.getSocketForUser(self.game.joinedBy, function(socketId) {		
			self.playerB = {
				userId: self.game.joinedBy,
				socketId: socketId
			};

			self.startGame();
		});	
	});
};

Play.prototype.startGame = function() {
	this.io.sockets.socket(this.playerA.socketId).emit("startGame", this.game);
	this.io.sockets.socket(this.playerB.socketId).emit("startGame", this.game);
	this.run();
};

Play.prototype.run = function() {

};

module.exports = Play;