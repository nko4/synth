var Application = {

	init: function() {
		var userData;
		$(document).ready(function() {

			var source   = $("#dashboard").html();
		//	var compiled = dust.compileFn(source,"dashboard"); 
		//	dust.loadSource(compiled);
			$.ajax({
				type: "GET",
				url: "/user",
			})
			.done(function( data ) {
				dust.render("dashboard", {name: data.name}, function(err, out) {
					$('#dashboardWrapper').show();
					console.log(err);
					console.log(out);
					$('#dashboardWrapper').append(out);
				});
		  	})
		  	.fail(function( data) {
		    	$('#register').show();
		 	});
			$('#registerForm').on('submit', function(evt) {
				evt.preventDefault();
				$.ajax({
					type: "POST",
					url: "/user",
					data: $('#registerForm').serialize()
				})
				.done(function( data ) {
			  		dust.render("dashboard", {name: "Fred"}, function(err, out) {
						$('#dashboardWrapper').show();
						console.log(err);
						console.log(out);
						$('#dashboardWrapper').append(out);
					});
			  	});
			});
		});
	}

};

Application.init();

