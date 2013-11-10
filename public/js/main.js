var Socket,
	gameInstance;

var Application = {

	init: function() {
		var userData,
			gameData,
		    _this = this;
		
		_this.getUserInfo();

		$('#registerForm').on('submit', function(evt) {
			evt.preventDefault();
			$.ajax({
				type: "POST",
				url: "/user",
				data: $('#registerForm').serialize()
			}).
			done(function(data) {
				$('#register').addClass('hide');
				_this.getUserInfo();
			});
		});
	},

	getUserInfo: function() {
		var _this = this;
		$.ajax({
			type: "GET",
			url: "/user",
		}).
		done(function(data) {
			userData = data;
			_this.renderUserInfo(userData);
			_this.getGamesInfo();
			Socket.init();
	  	}).
	  	fail(function(data) {
	    	$('#register').removeClass('hide');
	    	$('#well').addClass('animated bounceInDown');
	 	});
	},

	renderUserInfo: function(userData) {
		var _this = this;
		dust.render("userInfo", userData, function(err, out) {
			$('#userInfo').remove();
			$('#userInfoWrapper').append(out);
			$('#dashboard').removeClass('hide').addClass('animated bounceIn');
		});
	},	

	getGamesInfo: function() {
		var _this = this;
		$.ajax({
			type: "GET",
			url: "/games/ready",
		}).
		done(function(data) {
			gameData = data;
			_this.renderDashboard(gameData);
	  	});
	},

	renderDashboard: function(gameData) {
		var _this = this;
		dust.render("gamesInfo", gameData, function(err, out) {	
			$('#gamesInfoWrapper').html(out);
			$('#dashboard').removeClass('hide');
			_this.initStartGameBtn();
			_this.initJoinGameBtn();
		});
	},

	initStartGameBtn: function() {
		var _this = this;
		$('#startGameBtn').on('click', function(evt) {
			$.ajax({
				type: "POST",
				url: "/game/start"
			}).
			done(function(data) {
				_this.getGamesInfo();
		  	});
		});
	},

	initJoinGameBtn: function() {
		var _this = this,
			target;
		$('#gamesList').on('click', function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			target = $(evt.target||evt.srcElement);
			if(target.hasClass('joinBtn')) {
				$.ajax({
					type: "POST",
					url: "/game/join/" + target.attr("data-id")
				}).
				fail(function() {
					target.remove();
					if($('#gamesList .joinBtn').length === 0) {
						$('#gamesList').html("");
					}					
					alert("oops game not found! try another game or start a new one!");
			  	});
			}
		});
	},

	appendNewGame: function(game) {
		if($('#gamesList .joinBtn').length === 0) {
			$('#gamesList').append('<a class="list-group-item active">List of open games - click to start</a>');
		}
		$('#gamesList').append('<a class="list-group-item joinBtn" data-id="' + game.gameId + '">Compete with ' + game.createdByName + '</a>');
	},

	renderGameView: function(data) {
		dust.render("game", {}, function(err, out) {
			$('#well').hide();	
			$('#game').html(out);
			$('body').removeClass('bg').addClass('clouds');	
			setTimeout(function() {
				gameInstance = new Game();
			}, 300);		
		});
	}
};

$(document).ready(function() {
	Application.init();
});


Socket = {
	init: function() {
		var socket = io.connect();
		socket.on('startGame', function (game) {
			console.log("startGame");
			Application.renderGameView();
		});

		socket.on('registeredUser', function () {
			console.log("registeredUser");
		});

		socket.on('dropBalloons', function (balloons) {
			console.log("dropBalloons");
			gameInstance.drop(balloons);

			/*simulate baloon burst 
			var randomBalloon = balloons[Math.floor(Math.random() * balloons.length)];
			console.log("didBurst balloonId: " + randomBalloon.id);
			socket.emit('didBurst', randomBalloon);*/
		});

		socket.on('doBurst', function (balloonId) {
			console.log("doBurst balloonId: " + balloonId);
		});

		socket.on('stopGame', function (gameResult) {
			if (gameResult.isTie){
				alert(gameResult.nameA+" Scored:" +gameResult.scoreA+ "\n" +gameResult.nameB+" Scored:" +gameResult.scoreB + "\nAnd its a TIE!!");
			} else {
				alert(gameResult.nameA+" Scored:" +gameResult.scoreA+ "\n" +gameResult.nameB+" Scored:" +gameResult.scoreB + "\nAnd the Winner is: "+gameResult.winner);
			}
			console.log("stopGame");
		});

		socket.on('newGame', function(game) {
			Application.appendNewGame(game);
		});
	}
};
