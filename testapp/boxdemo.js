	function init(type,location) {
		if (!type) {
			type = "a";
		}
		if (!location) {
			location = 50;
		}
		// Define the canvas
		var canvaselem = document.getElementById("canvas");
		var context = canvaselem.getContext("2d");
		var canvaswidth = canvaselem.width-0;
		var canvasheight = canvaselem.height-0;

		// Define the world
		var gravity = new b2Vec2(0, 9);
		var doSleep = true;
		var world = new b2World(gravity, doSleep);
		var deletionBuffer = 4;
         
		//create ground
		var fixDef = new b2FixtureDef;
		fixDef.density = .5;
		fixDef.friction = 0.4;
		fixDef.restitution = 0.2;
		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_staticBody;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(canvaswidth/2,2);
		bodyDef.position.Set(canvaswidth/2, 0);
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		bodyDef.position.Set(canvaswidth/2, canvasheight -2);
		world.CreateBody(bodyDef).CreateFixture(fixDef);
         
		// Start dropping some shapes
		//addArrow();
		//addCircleA();
		//addCircleB();
		canvaselem.onclick = function(){ 
			addArrow();
		};
	    //setup debug draw
	    // This is used to draw the shapes for debugging. Here the main purpose is to 
	    // verify that the images are in the right location 
	    // It also lets us skip the clearing of the display since it takes care of it.

	 // The refresh rate of the display. Change the number to make it go faster
			z = window.setInterval(update2, 1000 / 600);


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
		  new b2Vec2(0,0), //(scale*0.966 , scale*0.6),
		  new b2Vec2(0,10), //(scale*-0.966, scale*0.6),
		  new b2Vec2(40,5), //(0, scale*-1),
		  ]);
            	bodyDef.position.x = 0;//(canvaswidth-scale*2)*Math.random()+scale*2;
	    	bodyDef.position.y = Math.floor((Math.random()*400)+1);
	    	var body=world.CreateBody(bodyDef);
	         body.CreateFixture(fixDef);
	         body.SetLinearVelocity(new b2Vec2(110,.7)); 
		//world.CreateBody(bodyDef).CreateFixture(fixDef);
	}

	 function addCircleA() {
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
			  9 //radius
		 );
            	bodyDef.position.x = (canvaswidth-scale*2)*Math.random() + scale*2;
	    	bodyDef.position.y =.5 ;// canvasheight- (scale*Math.random() +scale*2);
	    	world.CreateBody(bodyDef).CreateFixture(fixDef);
	 }

	 // Update the world display and add new objects as appropriate
	 function update2() {
		world.Step(1 / 60, 10, 10);
		context.clearRect(0,0,canvaswidth,canvasheight);
	    	world.ClearForces();
	    
	    	processObjects();
	    	var M = Math.floor((Math.random()*10)+1);
	    	if (M < 5) {			
			addCircleA();
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
			if (position.x < -deletionBuffer || position.x >(canvaswidth+4)) {
				world.DestroyBody(b);
				continue;
		 	}

			// Draw the dynamic objects
			if (b.GetType() == b2Body.b2_dynamicBody) {

				var flipy = position.y;//canvasheight - position.y;
				var fl = b.GetFixtureList();
				if (!fl) {
					continue;
				}
				var shape = fl.GetShape();
				var shapeType = shape.GetType();
				
				if (shapeType == b2Shape.e_polygonShape) {
					var edge = b.GetContactList();
					while (edge)  {
						var other = edge.other;
						
							var othershape = other.GetFixtureList().GetShape();
							if (othershape.GetType() == b2Shape.e_circleShape) {
								world.DestroyBody(other);
								break;	
							 }
						 edge = edge.next;
					}
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
				 // draw a circle - a solid color, so we don't worry about rotation
				 else if (shapeType == b2Shape.e_circleShape) {
					context.strokeStyle = "#CCCCCC";
					context.fillStyle = "#FF8800";
					context.beginPath();
					context.arc(position.x,flipy,shape.GetRadius(),0,Math.PI*2,true);
					context.closePath();
					context.stroke();
					context.fill();
				 }

			 }
		 }
	 }
 
};

