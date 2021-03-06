
window.Actor = Actor;

var global_maxActorSpeed = 500;
var global_newIdIndex = 1;

function Actor(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart)
{
	this.id = global_newIdIndex++;

	// Sprite
	this.sprite = sprite;

	// Position
	this.x = x;
	this.y = y;

	// Movement
	this.xspeed = 0;
	if (typeof xspeed !== "undefined") this.xspeed = xspeed;
	this.yspeed = 0;
	if (typeof yscale !== "undefined") this.yspeed = yspeed;

	// Limiters
	this.maxspeed = global_maxActorSpeed;

	// Sprite and Collision data
	this.scale = 1.0; // For variable-size sprites
	if (typeof scale !== "undefined") this.scale = scale;

	// Gravity data
	this.mass = 1.0; // The effects of gravity will be multiplied times this value
	if (typeof mass !== "undefined") this.mass = mass;

	this.ignorecollisions = false;
	if (typeof ignorecollisions !== "undefined") this.ignorecollisions = ignorecollisions;

	this.smart = 500;
	if (typeof smart !== "undefined") this.smart = smart;

	// For AI and collision detection
	this._listoftargets = [];
	this._iscolliding = false;

	// Flag for deletion
	this.deleteme = false;

	// Death animation
	this.isdead = false;
	this._deathanimationtimeout = 2.5;
}


// ====== GET AND SET ======
Actor.prototype.getSprite = function(){
	if (this.hasOwnProperty('sprite')) return this.sprite;
	return false; // ??? // Add a "model missing" sprite?
};
Actor.prototype.getMass = function() {
	return this.mass;
};

Actor.prototype.getWidth = function(){
	return this.getSprite().size[0]/2 * this.scale;
};
Actor.prototype.getHeight = function(){
	return this.getSprite().size[1]/2 * this.scale;
};

// ====== UPDATE FUNCTIONS ======
// The update() function will (usually?) stay constant, but some actors will overwrite the updatePosition() prototype with their own
Actor.prototype.update = function (dt, worldSize)
{
	// Functions
	this.getSprite().update(dt);

	this.processControls(dt); // AI or keybinding

	this.updatePosition(dt, worldSize);

	this.updateLifespan(dt);

	//if (this.scale < 1.0) this.scale += 0.0003; // TODO: MAKE AN ENEMY THAT DOES THIS IT LOOKS AWESOME!
};

Actor.prototype.updateLifespan = function (dt) {
	// Timers
	if (!isNaN(dt)) {
		// Death animation
		if (this.isdead) {
			if (this._deathanimationtimeout > 0) {
				this._deathanimationtimeout -= dt;
				if (this.deathtarget) {
					if (this._deathanimationtimeout < 0.75) {
						this.xspeed = 0;
						this.yspeed = 0;
						/*
						if (this.deathtarget.x > this.x) {
							this.x += Math.abs(this.x - this.deathtarget.x) * dt/this._deathanimationtimeout;
						} else {
							this.x -= Math.abs(this.x - this.deathtarget.x) * dt/this._deathanimationtimeout;
						}
						if (this.deathtarget.y > this.y) {
							this.y += Math.abs(this.y - this.deathtarget.y) * dt/this._deathanimationtimeout;
						} else {
							this.y -= Math.abs(this.y - this.deathtarget.y) * dt/this._deathanimationtimeout;
						}
						*/
						var x = data_renderOffsetX - (canvas.width/2 - 40);
						var y = data_renderOffsetY + (canvas.height/2 - 40);
						if (x > this.x) {
							this.x += Math.abs(this.x - x) * dt/this._deathanimationtimeout;
						} else {
							this.x -= Math.abs(this.x - x) * dt/this._deathanimationtimeout;
						}
						if (y > this.y) {
							this.y += Math.abs(this.y - y) * dt/this._deathanimationtimeout;
						} else {
							this.y -= Math.abs(this.y - y) * dt/this._deathanimationtimeout;
						}
					}
				}
			} else {
				this.deleteme = true;
			}
		} else {
			// Lifespan
			if (this.hasOwnProperty('lifespan'))
			{
				//console.log(this.actortype + ' lifespan: ' + this.lifespan + ' - ' + dt);

				this.lifespan -= dt;
				if (this.lifespan <= 0 && !this.deleteme) this.playDeathEvent();
			}
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
	// // Loop around closed universe
	// while ((this.x+this.getWidth()) < -canvas.width/2 || (this.x-this.getWidth()) > canvas.width/2) {
	// 	this.x *= -0.99;
	// 	console.log('actor looped around the world (x)');
	// }

	//console.log("x: " + this.x + " y: " + this.y + " xspeed: " + this.xspeed + " yspeed: " + this.yspeed);

	this.x += this.xspeed * dt;
	this.y += this.yspeed * dt;

	if (this.mass != 0) {
		this.yspeed += data_gravity * this.mass;
	}

	// Collision halts movement speed before next frame where updatePosition is called
	// This placement is especially important because it keeps gravity from dragging the actor through the floor
	this.updateCollisions(dt, worldSize);
};

Actor.prototype.updateCollisions = function (dt, worldSize) {
	// Collision halts movement speed before next frame where x and y pos are updated
	this._iscolliding = false;
	if (!this.ignorecollisions) {

		// Collision halts movement speed before next frame where x and y pos are updated
		for(var i in this._listoftargets) {
			if (this.getCollision(this._listoftargets[i], dt)) {
				if (!this.ignorecollisions && !this._listoftargets[i].ignorecollisions) {
					this.handleCollisionOffset(this._listoftargets[i], dt);
					this.runCollisionSecondaryEffects(this._listoftargets[i]);
					this._iscolliding = true;
				}
			}
		}

		// Edge of world
		// Collision halts movement speed before next frame where x and y pos are updated
		if ((this.y-1 - this.getHeight()) <= data_deathFallHorizon && this.yspeed < 0) {
			this.yspeed = 0;
			//this.y = this.getHeight() -(canvas.height/2);
			//this._iscolliding = true;
			this.playDeathEvent();
		}

	} // ignore collisions
};


// ====== AI FUNCTIONS ======
Actor.prototype.addTarget = function(obstacle) {
	var hasActor = false;
	if (this.id == obstacle.id) { hasActor = true; }
	else {
		for(var i in this._listoftargets) {
			if (this._listoftargets[i].id == obstacle.id) {
				hasActor = true;
				break;
			}
		}
	}
	if (!hasActor) { this._listoftargets.push(obstacle); }
};
Actor.prototype.removeTarget = function(obstacle) {
	for(var i in this._listoftargets) {
		if (this._listoftargets[i].id == obstacle.id) {
			this._listoftargets.splice(i, 1);
			break;
		}
	}
};
Actor.prototype.removeAllTargets = function(obstacle) {
	this._listoftargets = [];
};

Actor.prototype.getCollision = function(obstacle, dt){
	/*
	// Type 1 (works best, but slight jump-over-edge bug)
	if (Math.abs(this.x - obstacle.x) <= (this.getWidth() + obstacle.getWidth())) {
		if (Math.abs(this.y - obstacle.y) <= (this.getHeight() + obstacle.getHeight())) {
			return true;
		}
	}
	return false;
	*/

	// Type 2
	if (Math.abs((this.x+this.xspeed*dt) - (obstacle.x+obstacle.xspeed*dt)) <= (this.getWidth() + obstacle.getWidth())) {
		//if (Math.abs(this.y - obstacle.y) <= (this.getHeight() + obstacle.getHeight())) {
		if (Math.abs((this.y+this.yspeed*dt) - (obstacle.y+obstacle.yspeed*dt)) <= (this.getHeight() + obstacle.getHeight())) {
			return true;
		}
	}
	return false;

};
Actor.prototype.handleCollisionOffset = function(obstacle, dt){
	/*
	// Type 1 (works best, but slight jump-over-edge bug)
	if (Math.abs(this.x - obstacle.x) > Math.abs(this.y - obstacle.y)) {
		//if (Math.abs(this.x - obstacle.x) > (this.getWidth() + obstacle.getWidth())/2) {
			this.handleCollisionOffsetX(obstacle);
		//}
		// if (this.getCollision(obstacle)) {
		// 	this.handleCollisionOffsetY(obstacle);
		// }
	} else {
		//if (Math.abs(this.y - obstacle.y) > (this.getHeight() + obstacle.getHeight())/2) {
			this.handleCollisionOffsetY(obstacle);
		//}
		// if (this.getCollision(obstacle)) {
		// 	this.handleCollisionOffsetX(obstacle);
		// }
	}
	*/

	
	// Type 2 - predict velocity
	if (Math.abs(this.y - obstacle.y) <= (this.getHeight() + obstacle.getHeight())) {
		if (Math.abs((this.x+this.xspeed*dt) - (obstacle.x+obstacle.xspeed*dt)) < (this.getWidth() + obstacle.getWidth())) {
			if (Math.abs(this.y - obstacle.y) < (obstacle.getHeight())) {
				this.handleCollisionOffsetX(obstacle);
			}
			this.xspeed = 0;
		}
	}
	if (Math.abs(this.x - obstacle.x) <= (this.getWidth() + obstacle.getWidth())) {
		if (Math.abs((this.y+this.yspeed*dt) - (obstacle.y+obstacle.yspeed*dt)) < (this.getHeight() + obstacle.getHeight())) {
			if (Math.abs(this.x - obstacle.x) < (obstacle.getWidth())) {
				this.handleCollisionOffsetY(obstacle);
			}
			this.yspeed = 0;
		}
	}
	
	
	/*
	// Type 3 - get nearest edge and move to it
	//if ((this.getWidth() + obstacle.getWidth() - Math.abs(this.x - obstacle.x)) < (this.getHeight() + obstacle.getHeight() - Math.abs(this.y - obstacle.y))) {
	if ((obstacle.getWidth() - Math.abs(this.x - obstacle.x)) <= (obstacle.getHeight() - Math.abs(this.y - obstacle.y))) {
		//this.handleCollisionOffsetX(obstacle);
		this.xspeed = 0;
		if (this.x > obstacle.x) {
			this.x = obstacle.x + (this.getWidth() + obstacle.getWidth() + 2);
		} else {
			this.x = obstacle.x - (this.getWidth() + obstacle.getWidth() + 2);
		}
	} else {
		//this.handleCollisionOffsetY(obstacle);
		this.yspeed = 0;
		if (this.y > obstacle.y) {
			this.y = obstacle.y + (this.getHeight() + obstacle.getHeight());
		} else {
			this.y = obstacle.y - (this.getHeight() + obstacle.getHeight() + 2);
		}
	}
	*/
	
	// Type 3 - get nearest edge and move to it
	//if ((this.getWidth() + obstacle.getWidth() - Math.abs(this.x - obstacle.x)) < (this.getHeight() + obstacle.getHeight() - Math.abs(this.y - obstacle.y))) {
	if ((obstacle.getWidth() - Math.abs(this.x - obstacle.x)) <= (obstacle.getHeight() - Math.abs(this.y - obstacle.y))) {
		this.handleCollisionOffsetX(obstacle);
	} else {
		this.handleCollisionOffsetY(obstacle);
	}
	
	
};
Actor.prototype.handleCollisionOffsetX = function(obstacle){
	// Type 1 & 2
	this.xspeed = 0;
	if (this.x > obstacle.x && (Math.abs(this.x - obstacle.x) < (this.getWidth() + obstacle.getWidth()))) {
		this.x = obstacle.x + (this.getWidth() + obstacle.getWidth() + 2);
	} else if (this.x < obstacle.x && (Math.abs(this.x - obstacle.x) < (this.getWidth() + obstacle.getWidth()))) {
		this.x = obstacle.x - (this.getWidth() + obstacle.getWidth() + 2);
	}
};
Actor.prototype.handleCollisionOffsetY = function(obstacle){
	// Type 1 & 2
	this.yspeed = 0;
	if (this.y > obstacle.y && (Math.abs(this.y - obstacle.y) < (this.getHeight() + obstacle.getHeight()))) {
		this.y = obstacle.y + (this.getHeight() + obstacle.getHeight() + 2);
	} else if (this.y < obstacle.y && (Math.abs(this.y - obstacle.y) < (this.getHeight() + obstacle.getHeight()))) {
		this.y = obstacle.y - (this.getHeight() + obstacle.getHeight() + 2);
	}
};


Actor.prototype.runCollisionSecondaryEffects = function(obstacle){
	// harm player
};


// ====== DEATH EVENT ======
Actor.prototype.setDeathEventTarget = function (recycleBin) {
	this.deathtarget = recycleBin;
};
Actor.prototype.playDeathEvent = function (instantdeath) {
	// Call this function just before deleting the object from the game
	// e.g.: missiles explode before dying

	if (!this.isdead) {
		this.isdead = true;
		//this.deleteme = true; // default death is instantaneous

		this.ignorecollisions = true;

		if (this.deathtarget) {
			this.xspeed += getRandomInt(-200, 0);
			this.yspeed += getRandomInt(450, 600);
		} else {
			this.xspeed += getRandomInt(-200, 200);
			this.yspeed += getRandomInt(450, 700);
			//this.mass = 3.0;
		}

		// Sound-effect
		//playSound('sounds/gunSilencer.mp3');
	}
};
