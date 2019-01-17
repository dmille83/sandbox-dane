//===================== Victim PROTOTYPE ======================
function Victim(sprite, x, y, angle, xspeed, yspeed, anglespeed)
{
	Actor.call(this, sprite, x, y, angle, xspeed, yspeed, anglespeed); // call super constructor.
	
	this.actortype = 'Victim';
	
	this.accelleration = 900;
	this.angleaccelleration = 300;

	this.smart = 300;
	
	this.radius = 16;

	this.boomtimer = 0;
}
// ====== WORLD OBJECT ======
// SOURCE:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
// subclass extends superclass
Victim.prototype = Object.create(Actor.prototype);
Victim.prototype.constructor = Victim;


// ====== OVERWRITTEN INHERITED FUNCTIONS ======
Victim.prototype.processControls = function (dt)
{
	// Here goes whatever control schema or AI this Actor uses (if any)
	
	
	// Move towards mouse direction (right-clicking)
	var mouseAngle = getAngle(0, 0, mousePos.x, mousePos.y);
	this.angle = mouseAngle;

	
	var magnitudeX = 0.0
	var magnitudeY = 0.0
	
	var magnitude = 1.0

	if (getDistance(0, 0, mousePos.x, mousePos.y) < outerThreshold) {
		
		magnitude = (getDistance(0, 0, mousePos.x, mousePos.y) - innerThreshold) / (outerThreshold - innerThreshold);
		if (magnitude < 0.0) magnitude = 0.0;
		if (magnitude > 1.0) magnitude = 1.0;
		
	
		if (input.isDown("UP") || input.isDown("W")) {
	//		this.xspeed += this.accelleration * magnitude * Math.sin((this.angle) * TO_RADIANS) * dt;
	//		this.yspeed += this.accelleration * magnitude * Math.cos((this.angle) * TO_RADIANS) * dt;
			magnitudeY = magnitudeY+1.0
		}
		if (input.isDown("DOWN") || input.isDown("S")) {
	//		this.xspeed -= this.accelleration * magnitude * Math.sin((this.angle) * TO_RADIANS) * dt;
	//		this.yspeed -= this.accelleration * magnitude * Math.cos((this.angle) * TO_RADIANS) * dt;
			magnitudeY = magnitudeY-1.0
		}
		if (input.isDown("RIGHT") || input.isDown("D")) {
	//		this.xspeed += this.accelleration * magnitude * Math.sin((this.angle+90) * TO_RADIANS) * dt;
	//		this.yspeed += this.accelleration * magnitude * Math.cos((this.angle+90) * TO_RADIANS) * dt;
			magnitudeX = magnitudeX+1.0
		}
		if (input.isDown("LEFT") || input.isDown("A")) {
	//		this.xspeed += this.accelleration * magnitude * Math.sin((this.angle-90) * TO_RADIANS) * dt;
	//		this.yspeed += this.accelleration * magnitude * Math.cos((this.angle-90) * TO_RADIANS) * dt;
			magnitudeX = magnitudeX-1.0
		}
		
	}
	
	// Accellerate
	this.xspeed += Math.sin((mouseAngle) * TO_RADIANS) * this.accelleration * magnitudeY * magnitude * dt;
	this.yspeed += Math.cos((mouseAngle) * TO_RADIANS) * this.accelleration * magnitudeY * magnitude * dt;
	this.xspeed += Math.sin((mouseAngle+90) * TO_RADIANS) * this.accelleration * magnitudeX * magnitude * dt;
	this.yspeed += Math.cos((mouseAngle+90) * TO_RADIANS) * this.accelleration * magnitudeX * magnitude * dt;
	
	
	// Brakes
	if (input.isDown("SPACE")) {
		this.xspeed = this.xspeed * 0.95
		this.yspeed = this.yspeed * 0.95
	}
	if (Math.abs(this.xspeed) > data_maxSpeed) this.xspeed = this.xspeed * 0.95
	if (Math.abs(this.yspeed) > data_maxSpeed) this.yspeed = this.yspeed * 0.95
	//console.log(this.yspeed);
	//console.log("(" + this.x + "," + this.y + ")");
	

	// Brakes
	if (input.isDown("F")) {
		this.xspeed = 0;
		this.yspeed = 0;
		this.anglespeed = 0;
	}
	
	
	// Fire weapon
	if (mouseButtonsDown[1] == true) {
		this.boomtimer = 1;
		for (var i in this._listoftargets) { //for(var i = 0; i < this._listoftargets.length; i++)
			//console.log(i);
			this.pushAwayActor(this._listoftargets[i], 40, dt);
		}
	}
	if (mouseButtonsDown[3] == true) {
		this.boomtimer = 1;
		for (var i in this._listoftargets) { //for(var i = 0; i < this._listoftargets.length; i++)
			//console.log(i);
			this.pushAwayActor(this._listoftargets[i], -40, dt);
		}
	}
	// Reduce weapon cooldown timer
	if (this.boomtimer > 0) {
		this.boomtimer -= dt;
	}




};

// ====== CUSTOM FUNCTIONS ======
Victim.prototype.pushAwayActor = function (target, force, dt)
{
	/*
	var force = 40;
	var angle = getAngle(this.x, this.y, target.x, target.y);
	if (Math.abs(angle - this.angle) > 15) return false;
	target.xspeed += Math.sin(angle * TO_RADIANS)*force;
	target.yspeed += Math.cos(angle * TO_RADIANS)*force;
	*/
	
	//var force = 40;
	var loopedXY = getLoopedWorldCoordinates(this.x, this.y, target.x, target.y)
	var angle = getAngle(this.x, this.y, loopedXY.x, loopedXY.y);
	if (Math.abs(angle - this.angle) > 15) return false;
	if (getDistance(this.x, this.y, loopedXY.x, loopedXY.y) > this.smart) return false;
	
	var vector = { x: 0, y: 0 };
	if (target.mass !== 0) vector = getVector(0, 0, angle, (force/target.mass));
	
	//target.xspeed += Math.sin(angle * TO_RADIANS)*force;
	//target.yspeed += Math.cos(angle * TO_RADIANS)*force;
	
	target.xspeed += vector.x;
	target.yspeed += vector.y;
};
