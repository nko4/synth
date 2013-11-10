var Game = function() {

    // Define the canvas
    var canvaselem = document.getElementById("canvas");
    var context = canvaselem.getContext("2d");
    var canvaswidth = canvaselem.width - 0;
    var canvasheight = canvaselem.height - 0;

    // Define the world
    var gravity = new b2Vec2(0, - 9);
    var doSleep = true;
    var world = new b2World(gravity, doSleep);
    var deletionBuffer = 4;
  //create players
	createPlayer(0,canvasheight/2);
	createPlayer(1,canvasheight/2);
	
    z = window.setInterval(update, 20);

    document.onkeydown = function checkKey(e) {
	    var event = window.event ? window.event : e;
	    if (true) {
	        
	        if (event.keyCode == "38"){
	        	
	        	movePlayer(0,"up");
	        }else if(event.keyCode == "40"){
	        	
	        	movePlayer(0,"down");
	        }else if(event.keyCode == "32"){
	         addArrow("0");
	        }
	    }
	};
	
	
	function movePlayer(type, direction){
		//do logic for player 1 or 2
		oldY = delPlayer(type);
		//move up or down
		//alert(canvasheight);
		if(direction =="up" && ((oldY + 10) < (canvasheight-30))){
			posY = oldY + 10;
		}else if(direction =="down" && ((oldY - 10) > 30)){
			posY = oldY - 10;
		}else{
			posY = oldY;
		}
		//Send to Server => movePlayer(2,direction);
		createPlayer(type,posY);
	}
	
	function createPlayer(type,posY){
	var bodyDef = new b2BodyDef;
	var fixDef = new b2FixtureDef;
	fixDef.density = 0;
	fixDef.friction = 0;
	fixDef.restitution = 0;
    bodyDef.type = b2Body.b2_staticBody;
 	fixDef.shape = new b2PolygonShape;
  	var scale = 30;
  	if(type == "0"){
	  	fixDef.shape.SetAsArray([
	  new b2Vec2(0,0), 
	  new b2Vec2(0,40),
	  new b2Vec2(50,20),
	  ]);
	  	bodyDef.position.x = 0;
  	} else if(type =="1"){
  		fixDef.shape.SetAsArray([
  		    new b2Vec2(0,0), 
  		    new b2Vec2(0,40),
  		    new b2Vec2(-50,20),
  		]);
  	bodyDef.position.x = canvaswidth;
  	}
  	bodyDef.position.y = posY;
    	var data = type;
		bodyDef.userData = data;
    	var body=world.CreateBody(bodyDef);
         body.CreateFixture(fixDef);    
	}


function addArrow(type) {
		
     var bodyDef = new b2BodyDef;
	var fixDef = new b2FixtureDef;
	fixDef.density = 3;
	fixDef.friction = .1;
	fixDef.restitution = 0.2;

     	bodyDef.type = b2Body.b2_dynamicBody;
 	fixDef.shape = new b2PolygonShape;
  	var scale = 30;
  	
  	//set shape based on arrow of player 1 or 2
  	arrowPos = getPosition(type);
  	if (type == "0"){
	  	fixDef.shape.SetAsArray([
	  new b2Vec2(0,0),
	  new b2Vec2(0,2),
	  new b2Vec2(60,1), 
	  ]);    
	  		bodyDef.position.x = 50;
    	//call addArrow(2);
    	
  	} else if (type =="1"){
  		fixDef.shape.SetAsArray([
  		 new b2Vec2(0,0),
  		 new b2Vec2(0,2),
  		 new b2Vec2(60,1), 
  		 ]);    
  		 bodyDef.position.x = canvaswidth -50;
  	}
  	bodyDef.position.y = arrowPos+20;
    	var body=world.CreateBody(bodyDef);
         body.CreateFixture(fixDef);
         body.SetLinearVelocity(new b2Vec2(5000,0)); 
	
}

function getPosition(whichPlayer){
	var node = world.GetBodyList();
	 while (node) {
		var b = node;
		node = node.GetNext();
		var position = b.GetPosition();
		if (b.GetType() == b2Body.b2_staticBody) {
			var oldY = position.y;
			var fl = b.GetFixtureList();
			if (!fl) {
				continue;
			}
			var shape = fl.GetShape();
			var shapeType = shape.GetType();
			if (shapeType == b2Shape.e_polygonShape) {
				if(b.m_userData == whichPlayer){
					return oldY;
			}
		}
		}
 }
}

    function update() {
        world.Step(1 / 60, 10, 10);
        context.clearRect(0, 0, canvaswidth, canvasheight);
        world.ClearForces();
        processObjects();
    }

    this.addBalloons = function(balloons) {
         if (!balloons){
            balloons = generateBalloons();
         }
        for (var i=0;i<balloons.length;i++) {
            var id = (balloons[i].id);
            var type = (balloons[i].type);
            var dropAt = (balloons[i].position);
            addCircle(id,type,dropAt);
        }
    };

    function addCircle(balloonId, type, dropAt) {

    	var bodyDef = new b2BodyDef;
		 var fixDef = new b2FixtureDef;
		 fixDef.density = 1;
		 fixDef.friction = 0.1;
		 fixDef.restitution = 0.2;
		 
		 var bodyDef = new b2BodyDef;
		 bodyDef.type = b2Body.b2_dynamicBody;
		 scale = 30;
		 fixDef.shape = new b2CircleShape(
			  40 //radius
		 );
           	bodyDef.position.x = 25 + Math.floor(canvaswidth*(dropAt/100));
	    	bodyDef.position.y = canvasheight ;
	    	var img = "";
	    	if (type = "0"){
	    		 img = "../css/playera-balloon.png";
	    	}
	    	else if (type = "1"){
	    		 img = "../css/playerb-balloon.png";
	    	}
	    	var data = { id: balloonId,
			    	 type: type,
			    	 imgsrc: img,
			    	 imgsize: 16,
				 bodysize: scale
		    	}
			bodyDef.userData = data;
	    	world.CreateBody(bodyDef).CreateFixture(fixDef);
	 }
    
    function generateBalloons() {
        var count = 1 + Math.floor(Math.random() * 2),
            balloons = [];

        for (var i = 0; i < count; i += 1) {
            balloons.push({
                id: 1 + Math.floor(Math.random() * 10000000000000),
                type: Math.floor(Math.random() * 2), //0 = playerA; 1 = playerB
                position: Math.floor(Math.random() * 100) + 1
            });
        }

        return balloons;
    }

    function delPlayer(whichPlayer){
		 var node = world.GetBodyList();
		 while (node) {
			var b = node;
			node = node.GetNext();
			var position = b.GetPosition();
			if (b.GetType() == b2Body.b2_staticBody) {
				var oldY = position.y;
				var fl = b.GetFixtureList();
				if (!fl) {
					continue;
				}
				var shape = fl.GetShape();
				var shapeType = shape.GetType();
				if (shapeType == b2Shape.e_polygonShape) {
					//p
					if(b.m_userData == whichPlayer){
						world.DestroyBody(b);
						return oldY;
					}
				}
			}
		 }
	 }
    // Draw the updated display
    // Also handle deletion of objects
    function processObjects() {
        var node = world.GetBodyList();
        while (node) {
            var b = node;
            node = node.GetNext();
            // Destroy objects that have floated off the screen
            var position = b.GetPosition();
            if (position.x < -deletionBuffer || position.x > (canvaswidth + 4)) {
                world.DestroyBody(b);
                continue;
            }
          //handle static bodies aka players
			if (b.GetType() == b2Body.b2_staticBody) {
				
				var flipy = position.y;//canvasheight - position.y;
				var fl = b.GetFixtureList();
				if (!fl) {
					continue;
				}
				
				var shape = fl.GetShape();
				var shapeType = shape.GetType();
				if (shapeType == b2Shape.e_polygonShape) {
					var vert = shape.GetVertices();
					
					context.beginPath();

					// Handle the possible rotation of the polygon and draw it
					b2Math.MulMV(b.m_xf.R,vert[0]);
					var tV = b2Math.AddVV(position, b2Math.MulMV(b.m_xf.R, vert[0]));
					context.moveTo(tV.x, canvasheight-tV.y);
					for (var i = 0; i < vert.length; i++) {
						var v = b2Math.AddVV(position, b2Math.MulMV(b.m_xf.R, vert[i]));
						context.lineTo(v.x, canvasheight - v.y);
					}
					context.lineTo(tV.x, canvasheight - tV.y);
					context.closePath();
					context.strokeStyle = "#CCCCCC";
					context.fillStyle = "#88FFAA";
					context.stroke();
					context.fill();
				}
			}

            // Draw the dynamic objects
            if (b.GetType() == b2Body.b2_dynamicBody) {

                var flipy = position.y;
                var fl = b.GetFixtureList();
                if (!fl) {
                    continue;
                }

                var shape = fl.GetShape();
                var shapeType = shape.GetType();

                if (shapeType == b2Shape.e_polygonShape) {

                    var edge = b.GetContactList();
                    while (edge) {
                        var other = edge.other;

                        var othershape = other.GetFixtureList().GetShape();
                        if (othershape.GetType() == b2Shape.e_circleShape) {
                            console.log(other.m_userData.id, other.m_userData.type); // send to Sam
                            world.DestroyBody(other);
                            break;
                        }
                        edge = edge.next;
                    }
                    var vert = shape.GetVertices();

                    context.beginPath();

                    // Handle the possible rotation of the polygon and draw it
                    b2Math.MulMV(b.m_xf.R, vert[0]);
                    var tV = b2Math.AddVV(position, b2Math.MulMV(b.m_xf.R, vert[0]));
                    context.moveTo(tV.x, canvasheight - tV.y);
                    for (var i = 0; i < vert.length; i++) {
                        var v = b2Math.AddVV(position, b2Math.MulMV(b.m_xf.R, vert[i]));
                        context.lineTo(v.x, canvasheight - v.y);
                    }
                    context.lineTo(tV.x, canvasheight - tV.y);
                    context.closePath();
                    context.strokeStyle = "#CCCCCC";
                    context.fillStyle = "#88FFAA";
                    context.stroke();
                    context.fill();

                }
                // draw a circle - a solid color, so we don't worry about rotation
                else if (shapeType == b2Shape.e_circleShape) {
                	if (b.m_userData && b.m_userData.imgsrc) {
						// Draw the image on the object
					var size = b.m_userData.imgsize;
					var imgObj = new Image(size,size);
					imgObj.src = b.m_userData.imgsrc;
					context.save();
					context.translate(position.x,flipy); 
					context.rotate(b.GetAngle());
					var s2 = -1*(size/2);
					var scale = b.m_userData.bodysize/-s2;
					context.scale(scale,scale);
					context.drawImage(imgObj,s2,s2);
					context.restore();
				 }
                }

            }
        }
    }    
    
}; 

Game.prototype.drop = function(balloons) {
    this.addBalloons(balloons);
};