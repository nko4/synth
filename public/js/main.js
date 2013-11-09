var Application = {

	init: function() {
		var userData;
		$(document).ready(function() {

			/* var source   = $("#dashboardWrapper").html();
			console.log(source);
			var compiled = dust.compileFn(source,"dashboard"); 
			dust.loadSource(compiled);
			console.log(compiled); */
			$.ajax({
				type: "GET",
				url: "/user",
			})
			.done(function( data ) {
				dust.render("dashboard", {uname: "sumit"}, function(err, out) {
					$('#dashboardWrapper').removeClass('hide');
					$('#dashboardWrapper').append(out);
					console.log(out);
				});
		  	})
		  	.fail(function( data) {
		    	$('#register').removeClass('hide');
		 	});
			$('#registerForm').on('submit', function(evt) {
				evt.preventDefault();
				$.ajax({
					type: "POST",
					url: "/user",
					data: $('#registerForm').serialize()
				})
				.done(function( data ) {
			  		dust.render("dashboard", {uname: "Fred"}, function(err, out) {
						$('#dashboardWrapper').removeClass('hide');
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

