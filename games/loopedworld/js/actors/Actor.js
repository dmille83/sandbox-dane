
window.Actor = Actor;


function Actor(sprite, x, y, angle, xspeed, yspeed, anglespeed)
{
	// Sprite
	this.sprite = sprite;
	
	// Type
	this.actortype = 'Actor';

	// Position
	this.x = x;
	this.y = y;
	this.angle = 0;

	// Movement
	if (xspeed) this.xspeed = xspeed;
	else this.xspeed = 0;
	if (yspeed) this.yspeed = yspeed;
	else this.yspeed = 0;
	if (anglespeed) this.anglespeed = anglespeed;
	else this.anglespeed = 0;

	// Limiters
	this.maxspeed = 700; //1000;

	// Gravity data
	this.mass = 1.0; // The effects of gravity will be multiplied times this value
	this.elasticity = 0.01;

	// Sprite and Collision data
	this.scale = 1.0; // For variable-size sprites

	// Flag for deletion
	this.killme = false;

	// AI Vars
	//this._currentenemytarget = false;
	this._listoftargets = [];
	//this.id = getRandomArbitrary(0.00001, 0.99999);
	this.smart = 200; // Target-detection radius
}


// ====== GET AND SET ======
Actor.prototype.getRadius = function () {
	if (this.hasOwnProperty('radius')) {
		console.log(this.actortype + " using actor radius");
		return (this.radius * this.scale);
	} else if (this.getSprite() && this.getSprite().hasOwnProperty('size')) {
		console.log(this.actortype + " using sprite size");
		return (this.getSprite().size[0] * this.scale)/2; // For spherical collision-checks
	}
	return 20; // default
};
//Actor.prototype.getCollisionRadius = function(){
//	return this.getRadius();
//};
Actor.prototype.getSprite = function(){ // "getSprite" ??? !!!
	if (this.hasOwnProperty('sprite')) return this.sprite;

	return false; // ??? // Add a "model missing" sprite?
};
Actor.prototype.getMass = function() {
	return this.mass;
};

// ====== FUNCTIONS ======
// The update() function will (usually?) stay constant, but some actors will overwrite the updatePosition() prototype with their own
Actor.prototype.update = function (dt, worldSize)
{
	// Functions
	this.getSprite().update(dt);

	this.processControls(dt);

	this.updatePosition(dt, worldSize);

	this.updateLifespan(dt);
	
	//this._listoftargets = [];
};

Actor.prototype.updateLifespan = function (dt) {
	// Timers
	if (!isNaN(dt))
	{
		// Lifespan
		if (this.hasOwnProperty('lifespan'))
		{
			//console.log(this.actortype + ' lifespan: ' + this.lifespan + ' - ' + dt);

			this.lifespan -= dt;
			if (this.lifespan <= 0 && !this.killme && !this.isdead) this.playDeathEvent();
		}
	}
};
Actor.prototype.processControls = function (dt)
{
	// Here goes whatever control schema or AI this Actor uses (if any)
	//console.log("default updateControls() was called...");
};
Actor.prototype.updatePosition = function (dt, worldSize)
{
	// Loop around closed universe
	var loopedXY = getLoopedWorldCoordinates(0, 0, this.x, this.y);
	this.x = loopedXY.x;
	this.y = loopedXY.y;
	
	if (Math.abs(this.xspeed) > this.maxspeed) this.xspeed *= (this.maxspeed / Math.abs(this.xspeed));
	if (Math.abs(this.yspeed) > this.maxspeed) this.yspeed *= (this.maxspeed / Math.abs(this.yspeed));
	
	this.x += this.xspeed * dt;
	this.y += this.yspeed * dt;

	this.angle += this.anglespeed * dt;
	if (this.angle <= -360) this.angle += 360;
	else if (this.angle >= 360) this.angle -= 360;
	
	// Collisions
	for(var i = 0; i < this._listoftargets.length; i++) this.collide(this._listoftargets[i]);
};


// ====== AI FUNCTIONS ======
Actor.prototype.feedListOfTargets = function(listOfTargets) {
	// For actors that need to act upon other actors

	//this._listoftargets = [];
	
	// for(var i = 0; i < this._listoftargets.length; i++)
	// {
	// 	if (!this._listoftargets[i] || getDistance(this.x, this.y, this._listoftargets[i].x, this._listoftargets[i].y) > this.smart)
	// 		this._listoftargets.splice(i--, 1);
	// }

	for(var i in listOfTargets)
	{
		var loopedXY = getLoopedWorldCoordinates(this.x, this.y, listOfTargets[i].x, listOfTargets[i].y);
		if (getDistance(this.x, this.y, loopedXY.x, loopedXY.y) <= this.smart)
			if (listOfTargets[i] != this)
				this._listoftargets.push(listOfTargets[i]);
	}
	
};

// ====== DEATH EVENT ======
Actor.prototype.playDeathEvent = function (instantdeath) {
	// Call this function just before deleting the object from the game
	// e.g.: missiles explode before dying

	this.killme = true;
};


// ====== RENDER ======
Actor.prototype.render = function () {
	
	ctx.save();
	ctx.scale(canvasScale, canvasScale);
	
	var xOffset = canvasSize/2 + this.x - player.x;
	var yOffset = canvasSize/2 - this.y + player.y;
	
	xOffset /= canvasScale;
	yOffset /= canvasScale;
	
	ctx.translate(xOffset, yOffset);
	
	// Draw a line to each target
	for (var i in this._listoftargets)
    {
		// Loop AI sight around world
		var loopedXY = getLoopedWorldCoordinates(this.x, this.y, this._listoftargets[i].x, this._listoftargets[i].y)
		xOffset = (loopedXY.x - this.x)/canvasScale;
		yOffset = -(loopedXY.y - this.y)/canvasScale;
		
		ctx.beginPath();
		ctx.lineWidth = 0.8; //0.3;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
		ctx.moveTo(0, 0);
		ctx.lineTo(xOffset, yOffset);
		//ctx.arc(xOffset, yOffset, 30 * canvasScale, 0, 2 * Math.PI, false);
		ctx.stroke();
	}

	ctx.restore();
	
	// Actual coordinates
	var x = this.x;
	var y = this.y;
	this.renderSprite(x, y);
	
	/*
	// Mirrored event-horizon coordinates
	var loopedXY = getLoopedWorldCoordinates(player.x, player.y, this.x, this.y);
	x = loopedXY.x;
	y = loopedXY.y;
	if (x != this.x || x != this.y) this.renderSprite(x, y);
	*/
	
	for (i = -1; i <= 1; i++) {
		for (j = -1; j <= 1; j++) {
			x = i*2*data_worldRadius + this.x;
			y = j*2*data_worldRadius + this.y;
			if (x != this.x || x != this.y) this.renderSprite(x, y);
		}
	}
	
};

Actor.prototype.renderSprite = function (x, y) {
	ctx.save();
	ctx.scale(canvasScale, canvasScale);
	
	var xOffset = canvasSize/2 + x - player.x;
	var yOffset = canvasSize/2 - y + player.y;
	
	xOffset /= canvasScale;
	yOffset /= canvasScale;
	
	ctx.translate(xOffset, yOffset);
	
	/*
	// Draw a line to each target
	for (var i in this._listoftargets)
    {
		// Loop AI sight around world
		//xOffset = canvasSize/2 + x - this._listoftargets.x;
		//yOffset = canvasSize/2 - x + this._listoftargets.y;
		
		// Loop AI sight around world
		var loopedXY = getLoopedWorldCoordinates(x, y, this._listoftargets[i].x, this._listoftargets[i].y)
		xOffset = (loopedXY.x - x)/canvasScale;
		yOffset = -(loopedXY.y - y)/canvasScale;
		
		ctx.beginPath();
		ctx.lineWidth = 0.8; //0.3;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
		ctx.moveTo(0, 0);
		ctx.lineTo(xOffset, yOffset);
		//ctx.arc(xOffset, yOffset, 30 * canvasScale, 0, 2 * Math.PI, false);
		ctx.stroke();
	}
	*/
	
	// Render sprite
	ctx.rotate((this.angle) * TO_RADIANS);
	ctx.scale(this.scale, this.scale);
	ctx.translate(-this.scale*this.getSprite().size[0]/2, -this.scale*this.getSprite().size[1]/2);
	this.getSprite().render(ctx);
	//this.sprite.update(); // ???
	
	/*
	// Render collision radius
	ctx.translate(this.scale*this.getSprite().size[0]/2, this.scale*this.getSprite().size[1]/2);
	ctx.beginPath();
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.lineWidth = 1;
	ctx.arc(0, 0, this.getRadius(), 0, 2 * Math.PI, false);
	ctx.stroke();
	*/
	
	ctx.restore();
};



Actor.prototype.isColliding = function (target) {
	if (this === target) return false;
	var loopedXY = getLoopedWorldCoordinates(this.x, this.y, target.x, target.y);
	//var loopedXY2 = getLoopedWorldCoordinates(target.x, target.y, this.x, this.y);
	if (getDistance(this.x, this.y, loopedXY.x, loopedXY.y) < (this.getRadius() + target.getRadius()))
	{
		return true;
	} 
	else
	{
		return false;
	}
};

Actor.prototype.collide = function (target) {
	if (this.isColliding(target) === true)
	{
		// do something directional
		var loopedXY = getLoopedWorldCoordinates(this.x, this.y, target.x, target.y);
		var angle = getAngle(this.x, this.y, loopedXY.x, loopedXY.y);
		var distance = this.getRadius() + target.getRadius();
		var vector = {x:0,y:0}; // = getVector(0, 0, angle, (this.getRadius() + target.getRadius()));
		//this.elasticity = 0.1;
		
		// Displacement
		if (this.mass === 0 && target.mass === 0) {
			return; // do nothing
		} else if (this.mass === 0 && target.mass !== 0) {
			// I am an Obstacle, shove target out of the way
			vector = getVector(this.x, this.y, angle, distance);
			target.x = vector.x;
			target.y = vector.y;
		} else if (this.mass !== 0 && target.mass === 0) {
			// Move out of the way of obstacle
			vector = getVector(target.x, target.y, angle, -distance);
			this.x = vector.x;
			this.y = vector.y
		} else {
			// Move myself and the target
			
			// Distance we overlap
			distance = this.getRadius() + target.getRadius() - getDistance(this.x, this.y, loopedXY.x, loopedXY.y);
			
			// Move the target away from me
			vector = getVector(loopedXY.x, loopedXY.y, angle, (1+distance/2));
			target.x = vector.x;
			target.y = vector.y;
			
			// Move myself away from target
			vector = getVector(this.x, this.y, angle, -(1+distance/2));
			this.x = vector.x;
			this.y = vector.y;
		}
		
		// Momentum (demo)
		this.xspeed *= 0.5;
		this.yspeed *= 0.5;
		/*
		if (this.mass !== 0) 
		{
			vector = {x:0,y:0};
			//if (getDistance(0, 0, this.xspeed, this.yspeed) <= 0) {
				vector = getVector(loopedXY.x, loopedXY.y, angle, 0.1 );
				this.xspeed += vector.x;
				this.yspeed += vector.y;
			//}
		}
		*/
		
		
		/*
		// Momentum
		var reduction = 0.3;
		vector = {x:0,y:0};
		if (target.mass !== 0) 
		{
			target.xspeed *= this.elasticity * target.elasticity;
			target.yspeed *= this.elasticity * target.elasticity;
		}
		if (this.mass !== 0) 
		{
			this.xspeed *= this.elasticity * target.elasticity;
			this.yspeed *= this.elasticity * target.elasticity;
		}
		if (target.mass !== 0) 
		{
			//vector = getVector(this.x, this.y, angle, getDistance(0, 0, target.xspeed, target.yspeed) * target.elasticity );
			vector = getVector(loopedXY.x, loopedXY.y, angle, reduction * getDistance(0, 0, this.xspeed, this.yspeed) * this.mass / target.mass );
			target.xspeed += vector.x;
			target.yspeed += vector.y;
		}
		if (this.mass !== 0) 
		{
			//vector = getVector(loopedXY.x, loopedXY.y, angle, getDistance(0, 0, this.xspeed, this.yspeed) * this.elasticity );
			vector = getVector(this.x, this.y, angle, -reduction * getDistance(0, 0, target.xspeed, target.yspeed) * target.mass / this.mass );
			this.xspeed += vector.x;
			this.yspeed += vector.y;
		}
		*/
		
		// Trigger any additional (non-physics) effects
		this.collisionEvent(target);
		//target.collide(this);
	}
};

Actor.prototype.collisionEvent = function (target) {
	// placeholder
};