(function(){dust.register("userInfo",body_0);function body_0(chk,ctx){return chk.write("<div id = \"userInfo\"><p>Registered user: <b>").reference(ctx._get(false, ["name"]),ctx,"h").write("</b></p><button id='startGameBtn' class = 'btn btn-primary'>Start New Game</button></div>");}return body_0;})();