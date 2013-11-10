window.box2dgame = function() {
    
};

window.box2dgame.prototype.init = function () {
    /*
	if (!type) {
		type = "0";
	}
	if (!location) {
		location = 50;
	}*/
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

    //create player 1
    var bodyDef = new b2BodyDef;
    var fixDef = new b2FixtureDef;
    fixDef.density = 1;
    fixDef.friction = .2;
    fixDef.restitution = 0.2;
    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;
    var scale = 30;
    fixDef.shape.SetAsArray([
    new b2Vec2(0, 0), //(scale*0.966 , scale*0.6),
    new b2Vec2(0, 40), //(scale*-0.966, scale*0.6),
    new b2Vec2(50, 20), //(0, scale*-1),
    ]);
    //bodyDef.bullet =true;    
    bodyDef.position.x = 0; //(canvaswidth-scale*2)*Math.random()+scale*2;
    bodyDef.position.y = 25; //Math.floor((Math.random()*400)+1);
    var body = world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);
    // body.SetLinearVelocity(new b2Vec2(90,-0.7));

    // Start dropping some shapes
    //addArrow();
    //addCircleA();
    //addCircleB();
    canvaselem.onclick = function() {
        addArrow();
    };
    //setup debug draw
    // This is used to draw the shapes for debugging. Here the main purpose is to 
    // verify that the images are in the right location 
    // It also lets us skip the clearing of the display since it takes care of it.

    // The refresh rate of the display. Change the number to make it go faster

    //balloons = generateBalloons();

    z = window.setInterval(box2dgame.update, 20); //1000 / 600);


    function addArrow() {
        //create simple triangle

        var bodyDef = new b2BodyDef;
        var fixDef = new b2FixtureDef;
        fixDef.density = 1;
        fixDef.friction = .2;
        fixDef.restitution = 0.2;

        bodyDef.type = b2Body.b2_dynamicBody;
        fixDef.shape = new b2PolygonShape;
        var scale = 30;
        fixDef.shape.SetAsArray([
        new b2Vec2(0, 0), //(scale*0.966 , scale*0.6),
        new b2Vec2(0, 8), //(scale*-0.966, scale*0.6),
        new b2Vec2(80, 4), //(0, scale*-1),
        ]);
        //bodyDef.bullet =true;    
        bodyDef.position.x = 0; //(canvaswidth-scale*2)*Math.random()+scale*2;
        bodyDef.position.y = Math.floor((Math.random() * 400) + 1);
        var body = world.CreateBody(bodyDef);
        body.CreateFixture(fixDef);
        body.SetLinearVelocity(new b2Vec2(90, - 0.7));
        //world.CreateBody(bodyDef).CreateFixture(fixDef);
    }

    function addCircle(balloonId, type, dropAt) {
        // create basic circle
        var bodyDef = new b2BodyDef;
        var fixDef = new b2FixtureDef;
        fixDef.density = 1;
        fixDef.friction = 0.1;
        fixDef.restitution = 0.2;

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        scale = 30; //Math.random() * 40;
        fixDef.shape = new b2CircleShape(
        40 //radius
        );
        bodyDef.position.x = (canvaswidth * (dropAt / 100));
        bodyDef.position.y = canvasheight; // canvasheight- (scale*Math.random() +scale*2);
        var data = {
            id: balloonId,
            type: type,
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

            // Draw the dynamic objects
            if (b.GetType() == b2Body.b2_dynamicBody) {

                var flipy = position.y; //canvasheight - position.y;
                var fl = b.GetFixtureList();
                if (!fl) {
                    continue;
                }

                var shape = fl.GetShape();
                var shapeType = shape.GetType();
                /*
			var edge = b.GetContactList();
			while (edge)  {
				var other = edge.other;
				
					var othershape = other.GetFixtureList().GetShape();
					if (othershape.GetType() == b2Shape.e_circleShape) {
						world.DestroyBody(other);
						break;	
					 }
				 edge = edge.next;
			} */

                if (shapeType == b2Shape.e_polygonShape) {

                    var edge = b.GetContactList();
                    while (edge) {
                        var other = edge.other;

                        var othershape = other.GetFixtureList().GetShape();
                        if (othershape.GetType() == b2Shape.e_circleShape) {
                            console.log(other.m_userData.id); // send to Sam
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
                    context.strokeStyle = "#CCCCCC";
                    if (b.m_userData.type == '0') {
                        context.fillStyle = "#FF8800";
                    } else {
                        context.fillStyle = "#000000";
                    }
                    context.beginPath();
                    context.arc(position.x, flipy, shape.GetRadius(), 0, Math.PI * 2, true);
                    context.closePath();
                    context.stroke();
                    context.fill();
                }

            }
        }
    }

};

	// Update the world display and add new objects as appropriate
window.box2dgame.prototype.update = function update() {
    world.Step(1 / 60, 10, 10);
    context.clearRect(0, 0, canvaswidth, canvasheight);
    world.ClearForces();
    //console.log(balloons);
    processObjects();
    balloons = generateBalloons();
    for (var i = 0; i < balloons.length; i++) {
        var id = (balloons[i].id);
        var type = (balloons[i].type);
        var dropAt = (balloons[i].position);
        addCircle(id, type, dropAt);
    }
}

	 