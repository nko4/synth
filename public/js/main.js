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
			$('#dashboard').removeClass('hide').addClass('animated flipInY');
			_this.initStartGameBtn();
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
			$('#gamesInfo').remove();
			if(gameData.games.length) {
				$('#gamesInfoWrapper').append(out);
				$('#dashboard').removeClass('hide');
				_this.initJoinGameBtn();
			}
		});
	},

	initStartGameBtn: function() {
		var _this = this;
		$('#startGameBtn').on('click', function(evt) {
			$.ajax({
				type: "POST",
				url: "/game/start"
			})
			.done(function( data ) {
				_this.getGamesInfo();
		  		alert('Game Started.. waiting for other player...');
		  	});
		});
	},

	initJoinGameBtn: function() {
		var _this = this;
		$('.joinBtn').on('click', function(evt) {
			$.ajax({
				type: "POST",
				url: "/game/join/"+$(this).attr("data-id")
			})
			.done(function( data ) {
				_this.getGamesInfo();
		  		alert('Game Joined');
		  	});
		});
	}

};

$(document).ready(function() {
	Application.init();
});



var socket = io.connect('/');
socket.on('startGame', function (game) {
	console.log("startGame");
	console.log(game);
});

socket.on('registeredUser', function () {
	console.log("registeredUser");
});

socket.on('dropBalloons', function (balloons) {
	console.log("dropBalloons");
	console.log(balloons);

	//simulate baloon burst 
	var randomBalloon = balloons[Math.floor(Math.random() * balloons.length)];
	console.log("didBurst balloonId: " + randomBalloon.id);
	socket.emit('didBurst', randomBalloon.id);
});

socket.on('doBurst', function (balloonId) {
	console.log("doBurst balloonId: " + balloonId);
});

socket.on('stopGame', function () {
	console.log("stopGame");
});
