(function(){dust.register("master",body_0);function body_0(chk,ctx){return chk.write("<!DOCTYPE html><html lang=\"en\"><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>balloon bursters</title><link rel=\"stylesheet\" href=\"css/style.css\"><link rel=\"stylesheet\" href=\"css/bootstrap.css\"><link rel=\"stylesheet\" href=\"css/animate.css\"><link href='http://fonts.googleapis.com/css?family=Nosifer' rel='stylesheet' type='text/css'></head><body><h2 class=\"page-header\">balloon bursters</h2><iframe class=\"vote\" src=\"http://nodeknockout.com/iframe/synth\" frameborder=0 scrolling=no allowtransparency=true width=115 height=25></iframe><div id=\"container\"><div id=\"well\" class=\"well well-lg\"><div id=\"register\" class=\"hide\"><div class=\"panel panel-info\"><div class=\"panel-heading\">Enter your name to get started!</div><div class=\"panel-body\"><form id=\"registerForm\"><div class=\"row\"><div class=\"col-lg-6\"><div class=\"input-group\"><input type=\"text\" class=\"form-control\" name=\"name\" autocorrect=\"off\" value=\"\" placeholder=\"Name\"><span class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"submit\" id=\"registerBtn\" type=\"button\">Start</button></span></div></div></div>\t\t\t\t\t\t</form></div></div></div><div id='dashboard' class=\"hide\"><div class=\"panel panel-success\"><div id='userInfoWrapper' class=\"panel-heading\"></div><div class=\"panel-body\"><div id='gamesInfoWrapper'></div></div></div></div>\t</div><div id=\"game\"></div></div><script src=\"js/lib/socket.io.js\"></script><script src=\"js/lib/jquery.min.js\"></script><script src=\"js/lib/dust-core-2.2.0.js\"></script><script src=\"js/lib/bootstrap.js\"></script><script src=\"js/lib/box2dv2.js\"></script><script src=\"js/game.js\"></script><script src=\"js/main.js\"></script><script src=\"views/userInfo.js\"></script><script src=\"views/gamesInfo.js\"></script><script src=\"views/game.js\"></script></body></html>");}return body_0;})();