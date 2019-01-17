//===================== ActorPlayer PROTOTYPE ======================
function ActorVirus001(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart, explosion_sprite)
{
	Actor.call(this, sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart); // call super constructor.

	this.explosion_sprite = explosion_sprite;

    this.scaleFlip = false;
	this.resizeRandomly = false;
	if (getRandomInt(0, 100) < 10) { this.resizeRandomly = true; }

	this._deathanimationtimeout = 0;
}
// ====== WORLD OBJECT ======
// subclass extends superclass
ActorVirus001.prototype = Object.create(Actor.prototype);
ActorVirus001.prototype.constructor = ActorVirus001;


// ====== FUNCTIONS ======
ActorVirus001.prototype.processControls = function (dt) {
// 	if (this.resizeRandomly) {
// 		if (getRandomInt(0, 1000) < 10) { this.scaleFlip = !this.scaleFlip; }
// 	    if (this.scaleFlip) {
// 	        if (this.scale < 1.0) {
// 	            this.scale += 0.0003; // TODO: MAKE AN ENEMY THAT DOES THIS IT LOOKS AWESOME!
// 	        } else {
// 	            this.scaleFlip = false;
// 	        }
// 	    } else {
// 	        if (this.scale > 0.2) {
// 	            this.scale -= 0.0003; // TODO: MAKE AN ENEMY THAT DOES THIS IT LOOKS AWESOME!
// 	        } else {
// 	            this.scaleFlip = true;
// 	        }
// 	    }
// 	}

//	if (this.lifespan <= 6.0) { this.scale += 0.0003; }

	if (this.hasOwnProperty("lifespan")) {
		//this.scale = 0.3*(dt/this.lifespan);
		this.scale += 0.03 * dt;
	} else {
		if (Math.abs(data_players[0].x - this.x) < this.smart + this.getWidth()) {
			this.lifespan = 4.0;
		}
	}
}

// ====== DEATH EVENT ======
ActorVirus001.prototype.playDeathEvent = function (instantdeath) {
	// Call this function just before deleting the object from the game
	// e.g.: missiles explode before dying

	if (!this.isdead) {
		this.isdead = true;
		//this.deleteme = true; // default death is instantaneous

		/*
		this.ignorecollisions = true;

		if (this.deathtarget) {
			this.xspeed += getRandomInt(-200, 0);
			this.yspeed += getRandomInt(550, 800);
		} else {
			this.xspeed += getRandomInt(-200, 200);
			this.yspeed += getRandomInt(450, 700);
			//this.mass = 3.0;
		}
		*/

		if (Math.abs(data_players[0].x - this.x) < this.smart + this.getWidth()) {
			this.scale *= 1.1;
			data_players[0].playDeathEvent();
		}

		// Sound-effect
		playSound('sounds/gunSilencer.mp3');
	}
};
