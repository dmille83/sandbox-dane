//===================== Obstacle PROTOTYPE ======================
function Obstacle(sprite, x, y, angle, xspeed, yspeed, anglespeed)
{
    Actor.call(this, sprite, x, y, angle, xspeed, yspeed, anglespeed); // call super constructor.
	
	this.actortype = 'Obstacle';
	
    this.accelleration = 100;
    this.angleaccelleration = 100;
	
	this.mass = 0; //10.0;
	
	this.radius = 8;
	
    this.smart = 200; //this.getRadius * 2;
}
// ====== WORLD OBJECT ======
// SOURCE:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
// subclass extends superclass
Obstacle.prototype = Object.create(Actor.prototype);
Obstacle.prototype.constructor = Obstacle;


// ====== FUNCTIONS ======
Obstacle.prototype.processControls = function (dt)
{
    // Here goes whatever control schema or AI this Actor uses (if any)
	
	var loopedXY = {x:0,y:0}, target, distance, angle, vector = {x:0,y:0};
    for (var i in this._listoftargets)
    {
		// Loop AI sight around world
		target = this._listoftargets[i];
		if (target.mass !== 0)
		{
			/*
			loopedXY = getLoopedWorldCoordinates(target.x, target.y, this.x, this.y);
			angle = getAngle(loopedXY.x, loopedXY.y, target.x, target.y);
			distance = 0.0001 * target.mass;
			vector = getVector(loopedXY.x, loopedXY.y, angle, distance);
			target.xspeed += vector.x * dt;
			target.yspeed += vector.y * dt;
			*/
			/*
			loopedXY = getLoopedWorldCoordinates(this.x, this.y, target.x, target.y);
			angle = getAngle(this.x, this.y, loopedXY.x, loopedXY.y);
			distance = -0.001 * target.mass;
			vector = getVector(this.x, this.y, angle, distance);
			target.xspeed += vector.x * dt;
			target.yspeed += vector.y * dt;
			*/
		}
	}
};