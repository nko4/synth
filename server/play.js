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
			name: self.game.createdByName,
			socketId: socketId,
			score: 0
		};

		self.store.getSocketForUser(self.game.joinedBy, function(socketId) {		
			self.playerB = {
				userId: self.game.joinedBy,
				name: self.game.joinedByName,
				socketId: socketId,
				score: 0
			};

			self.startGame();
		});	
	});
};

Play.prototype.startGame = function() {
	this.bootstrapBurst();
	this.bootstrapPlayerMovements();
	this.io.sockets.socket(this.playerA.socketId).emit("startGame", this.game);
	this.io.sockets.socket(this.playerB.socketId).emit("startGame", this.game);	
	this.run();
};

Play.prototype.bootstrapBurst = function() {
	var self = this, currentScoreA, currentScoreB;
	self.io.sockets.socket(self.playerA.socketId).on("didBurst", function(balloon) {
		currentScoreA = self.playerA.score;
		self.playerA.score = balloon.type == 0 ? currentScoreA + 1 : currentScoreA - 1;
		console.log(self.playerA.name+" Score:: "+self.playerA.score);
		self.io.sockets.socket(self.playerB.socketId).emit("doBurst", balloon.id);
	});
	self.io.sockets.socket(self.playerB.socketId).on("didBurst", function(balloon) {
		currentScoreB = self.playerB.score;
		self.playerB.score = balloon.type == 1 ? currentScoreB + 1 : currentScoreB - 1;
		self.io.sockets.socket(self.playerA.socketId).emit("doBurst", balloon.id);
		console.log(self.playerB.name+" Score:: "+self.playerB.score);
	});
};

Play.prototype.bootstrapPlayerMovements = function() {
	var self = this;
	self.io.sockets.socket(self.playerA.socketId).on("didMove", function(position) {
		self.io.sockets.socket(self.playerB.socketId).emit("doMove", position);
	});
	self.io.sockets.socket(self.playerB.socketId).on("didMove", function(position) {
		self.io.sockets.socket(self.playerA.socketId).emit("doMove", position);
	});
};

Play.prototype.run = function() {
	var self = this;
		counter = 0,
		max = 10;

	var intervalID = setInterval(function() {
		if(counter < max) {
			counter+=1;
			var balloons = self.generateBalloons();
			self.io.sockets.socket(self.playerA.socketId).emit("dropBalloons", balloons);
			self.io.sockets.socket(self.playerB.socketId).emit("dropBalloons", balloons);			
		}
		else {
			clearInterval(intervalID);
			self.game.winner = self.playerA.score > self.playerB.score ? self.playerA.name : self.playerB.name;
			self.stop();
		}
	}, 2000);
};

Play.prototype.stop = function() {
	this.io.sockets.socket(this.playerA.socketId).emit("stopGame", this.game);
	this.io.sockets.socket(this.playerB.socketId).emit("stopGame", this.game);
};

Play.prototype.generateBalloons = function() {
	var count = 1 + Math.floor(Math.random()*20),
		balloons = [];

	for(var i = 0; i < count; i+=1) {
		balloons.push({
			id: 1 + Math.floor(Math.random()*10000000000000),
			type: Math.floor(Math.random()*2), //0 = playerA; 1 = playerB
			position: Math.floor(Math.random()*100) + 1
		});	
	}

	return balloons;
};


module.exports = Play;