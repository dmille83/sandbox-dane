//===================== Monster PROTOTYPE ======================
function Monster(sprite, x, y, angle, xspeed, yspeed, anglespeed)
{
    Actor.call(this, sprite, x, y, angle, xspeed, yspeed, anglespeed); // call super constructor.
	
	this.actortype = 'Monster';
	
    this.accelleration = 100;
    this.angleaccelleration = 100;
	
	this.mass = 0.1;

    this.smart = 600;
}
// ====== WORLD OBJECT ======
// SOURCE:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
// subclass extends superclass
Monster.prototype = Object.create(Actor.prototype);
Monster.prototype.constructor = Monster;


// ====== FUNCTIONS ======
Monster.prototype.processControls = function (dt)
{
    // Here goes whatever control schema or AI this Actor uses (if any)
	
	// TEMP: Disabled AI
	//return false;
	
    // Pick ONE target to pursue
    var currentTarget = false;
	var loopedXY_Current = {x:0,y:0}, loopedXY_Next = {x:0,y:0}, distance, angle, vector = {x:0,y:0};
    for (var i in this._listoftargets)
    {
		// Loop AI sight around world
		loopedXY_Next = getLoopedWorldCoordinates(this.x, this.y, this._listoftargets[i].x, this._listoftargets[i].y);
		distance = getDistance(this.x, this.y, loopedXY_Next.x, loopedXY_Next.y);
		
		// Targeting
		if (this._listoftargets[i].actortype == 'Victim')
		{
			if (!currentTarget || distance < getDistance(this.x, this.y, loopedXY_Current.x, loopedXY_Current.y)) 
			{
				currentTarget = this._listoftargets[i];
				// Loop AI sight around world
				loopedXY_Current = getLoopedWorldCoordinates(this.x, this.y, currentTarget.x, currentTarget.y)
			}
		}
		
		// Obstacle avoidance
		if (distance < this.getRadius() + 20)
		{
			angle = getAngle(loopedXY_Next.x, loopedXY_Next.y, this.x, this.y);
			vector = getVector(this.x, this.y, angle, this.accelleration / 2);
			this.xspeed += vector.x * dt;
			this.yspeed += vector.y * dt;
		}
    }
	
	/*
	// TEMP: 
	currentTarget = player;
	loopedXY_Current = getLoopedWorldCoordinates(this.x, this.y, currentTarget.x, currentTarget.y)
	*/
	
    if (!currentTarget)
    {
        if (this.xspeed > 0) this.xspeed -= this.accelleration * dt;
        if (this.xspeed < 0) this.xspeed += this.accelleration * dt;
        if (this.yspeed > 0) this.yspeed -= this.accelleration * dt;
        if (this.yspeed < 0) this.yspeed += this.accelleration * dt;
        return;
    }


    /*
    // SOURCE:  http://answers.unity3d.com/questions/161202/physics-based-homing-missile.html
    var turningSpeed = 0.001;
    //var targetDirection = getAngle(this.x, this.y, currentTarget.x, currentTarget.y);
    var targetDirection = getActorAngleOffset(this, currentTarget);
    var crossProduct = getCrossProduct(this.x+this.xspeed, this.y+this.yspeed, currentTarget.x+currentTarget.xspeed, currentTarget.y+currentTarget.yspeed);
    var changeOrientation = (crossProduct * (targetDirection*TO_RADIANS) * turningSpeed) % 360;
    console.log(targetDirection);
    this.anglespeed += changeOrientation;

    //this.xspeed += Math.sin(this.angle * TO_RADIANS)*this.accelleration*dt;
    //this.yspeed -= Math.cos(this.angle * TO_RADIANS)*this.accelleration*dt;
    */


    /*
    var angleaccelleration = 100 * dt;
    var targetDirection = getActorAngleOffset(this, currentTarget);
    //console.log(targetDirection);
    if (targetDirection < 0) angleaccelleration *= -1;
    else if (targetDirection > 0) {}

    if (Math.abs(this.anglespeed + angleaccelleration) > Math.abs(targetDirection/(this.anglespeed*dt)))
    {
        console.log('-');
        this.anglespeed -= angleaccelleration * dt;
    }
    else
    {
        console.log('+');
        this.anglespeed += angleaccelleration * dt;
    }
    */


    /*
        http://mathforum.org/library/drmath/view/56335.html

        a = (s1 - s2)/t;
        d = 0.5*(s1 + s2)*t

        d/(0.5*(s1 + s2)) = t
        a*d = (s1 - s2)/(0.5*(s1 + s2))
        s2 = 0
        a*d = (s1 - 0)/(0.5*(s1 + 0))
        a*d = s1/(0.5*s1)
        a*d = 2
        d = 2/a

        s   = ut + .5a(t^2)
        s   = .5(u + v)t
        2*s/(u + v) = t
        s = u*2*s/(u + v) + 0.5*a*((2*s/(u + v))^2)


        v^2 =u^2 +2as
        0 = this.xspeed^2 + 2*this.accelleration*distance
        this.xspeed^2 = -2*this.accelleration*distance
        Math.pow(this.xspeed, 2)/(-2*this.accelleration) = distance
        this.accelleration = (this.xspeed)/dt;


        d = -u² / 2a
        distance = -Math.pow(this.xspeed, 2)/(2*this.accelleration)


    */

    var targetDirection = getAngle(this.x, this.y, loopedXY_Current.x, loopedXY_Current.y);
    this.angle = rotateToFaceAngle(this.angle, targetDirection, 1);

    /*
        ...if distance from target < (this speed + this actor's projectile speed) * projectile lifespan
            ...and if target is within 15 degrees of this actor's nose angle:
                ...then fire weapon(s)
    */


    var myAccelleration = this.accelleration * dt;
    //var targetDistance = getDistance(this.x, this.y, currentTarget.x, currentTarget.y);

    var targetX = loopedXY_Current.x + currentTarget.xspeed;
    var targetY = loopedXY_Current.y + currentTarget.yspeed;
    var thisX = this.x + this.xspeed;
    var thisY = this.y + this.yspeed;
    

    var targetDistance = getDistance(thisX, thisY, targetX, targetY);

    //var myAccellerationX = myAccelleration;
    //var myAccellerationY = myAccelleration;

    if (targetDistance >= 100 && targetDistance <= 150)
    {
        if (this.xspeed > 0) this.xspeed -= this.accelleration * dt;
        if (this.xspeed < 0) this.xspeed += this.accelleration * dt;
        if (this.yspeed > 0) this.yspeed -= this.accelleration * dt;
        if (this.yspeed < 0) this.yspeed += this.accelleration * dt;
        return;
    }
    else if (targetDistance < 100) {
        myAccelleration *= -1;
        //myAccellerationX *= -1;
        //myAccellerationY *= -1;
    }
    // else
    // {
    //     if (Math.abs(thisX) - Math.abs(targetX) <= Math.abs(Math.pow(this.xspeed, 2)/(2*myAccellerationX))) myAccellerationX *= -1;
    //     if (Math.abs(thisY) - Math.abs(targetY) <= Math.abs(Math.pow(this.xspeed, 2)/(2*myAccellerationY))) myAccellerationY *= -1;
    // }



    if (thisX < targetX)
    {
        if (Math.abs(this.xspeed + myAccelleration) < this.maxspeed)
            this.xspeed += myAccelleration;
    }
    else
    {
        if (Math.abs(this.xspeed - myAccelleration) < this.maxspeed)
            this.xspeed -= myAccelleration;
    }

    if (thisY < targetY)
    {
        if (Math.abs(this.yspeed + myAccelleration) < this.maxspeed)
            this.yspeed += myAccelleration;
    }
    else
    {
        if (Math.abs(this.yspeed - myAccelleration) < this.maxspeed)
            this.yspeed -= myAccelleration;
    }



    /*
    if (currentTarget.x > this.x)
    {
        if (Math.abs(thisX - targetX) <= Math.abs(-Math.pow(this.xspeed, 2)/(2*myAccelleration)))
        {
            this.xspeed -= myAccelleration;
            //console.log("x-");
        }
        else {
            this.xspeed += myAccelleration;
            //console.log("x+");
        }
    }
    else if (currentTarget.x < this.x)
    {
        if (Math.abs(targetX - thisX) <= Math.abs(Math.pow(this.xspeed, 2)/(2*myAccelleration)))
        {
            this.xspeed += myAccelleration;
            //console.log("x+");
        }
        else
        {
            this.xspeed -= myAccelleration;
            //console.log("x-");
        }
    }

    if (currentTarget.y > this.y)
    {
        if (Math.abs(thisY - targetY) <= Math.abs(Math.pow(this.yspeed, 2)/(2*myAccelleration)))
        {
            this.yspeed -= myAccelleration;
            //console.log("y-");
        }
        else {
            this.yspeed += myAccelleration;
            //console.log("y+");
        }
    }
    else if (currentTarget.y < this.y)
    {
        if (Math.abs(targetY - thisY) <= Math.abs(Math.pow(this.yspeed, 2)/(2*myAccelleration)))
        {
            this.yspeed += myAccelleration;
            //console.log("y+");
        }
        else
        {
            this.yspeed -= myAccelleration;
            //console.log("y-");
        }
    }
    */


};
Monster.prototype.isColliding = function (target) {
	if (this === target) return false;
	var loopedXY = getLoopedWorldCoordinates(this.x, this.y, target.x, target.y);
	//var loopedXY2 = getLoopedWorldCoordinates(target.x, target.y, this.x, this.y);
	if (getDistance(this.x, this.y, loopedXY.x, loopedXY.y) < (this.getRadius() + target.getRadius()))
	{
		if (this.actortype == target.actortype) return false;
		return true;
	} 
	else
	{
		return false;
	}
};
