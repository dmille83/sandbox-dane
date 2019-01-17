//===================== ActorPlayer PROTOTYPE ======================
function ActorPlayer(sprites, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart)
{
	// Sprites
	this.sprites = sprites;
	this.sprite = this.sprites["walk_left"];

	Actor.call(this, this.sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart); // call super constructor.

	this.accelleration = 250.0;
	this.jumpstartspeed = 300.0;

	this.lastDirectionKey = 1; // 1 == right, 0 == left

	this.jumptimout = 0;
	this.attacktimeout = 0;
	this.poweruptimout = 0;
	this.idletime = 0;

	// Reset level or end game on death
	this._resetlevelondeath = true;
	this._isplayer = true;

	// Sound triggers
	this._soundtimeout_swoosh = 0;
	this._soundtimeout_jump = 0;
}
// ====== WORLD OBJECT ======
// SOURCE:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
// subclass extends superclass
ActorPlayer.prototype = Object.create(Actor.prototype);
ActorPlayer.prototype.constructor = ActorPlayer;


// ====== FUNCTIONS ======
ActorPlayer.prototype.processControls = function (dt)
{
	// Here goes whatever control schema or AI this Actor uses (if any)

	//console.log("x: " + this.x + " y: " + this.y + " xspeed: " + this.xspeed + " yspeed: " + this.yspeed + " collision: " + this._iscolliding);
	if (!this.isdead) {

		// Update sound-effect timers
		if (this._soundtimeout_swoosh > 0) { this._soundtimeout_swoosh -= dt; }
		if (this._soundtimeout_jump > 0) { this._soundtimeout_jump -= dt; }

		// Powerup timout
		if (this.poweruptimout > 0) { this.poweruptimout -= dt; return; }


		// Powerups
		if (data_powerupChosen == 1) {
			if (input.isDown("SPACE") && this.attacktimeout <= 0) {
				if (this.jumptimout <= 0) {
					this.attacktimeout = 0.5;
					if (this.lastDirectionKey == 1) {
						this.sprite = this.sprites["slash_right"];
						//this.getSprite().frames = [0, 1, 2, 4];
						this.getSprite()._index = 0;
					} else {
					 	this.sprite = this.sprites["slash_left"];
					 	//this.getSprite().frames = [3, 2, 1, 0];
					 	this.getSprite()._index = 0;
					}
					if (this._soundtimeout_swoosh <= 0) {
						this._soundtimeout_swoosh = 0.5;
						playSound('sounds/sword_swoosh.wav');
					}
				} else {
					this.attacktimeout = 2.5;
					this.sprite = this.sprites["downslash"];
					this.getSprite().frames = [0, 1, 2, 3];
					this.getSprite()._index = 0;
					if (this._soundtimeout_swoosh <= 0) {
						this._soundtimeout_swoosh = 0.5;
						playSound('sounds/sword_thud.mp3');
					}
				}
			}
			if (this.attacktimeout > 0) {
				this.attacktimeout -= dt;
				if ((this.sprite == this.sprites["slash_right"] || this.sprite == this.sprites["slash_left"] || this.sprite == this.sprites["downslash"]) && this.getSprite()._index < this.getSprite().frames.length) { return; }
			}
		}


		// MOVEMENT KEYBINDINGS
		// No changing direction in mid-jump
		//if (this.yspeed == 0) {

			if (input.isDown("RIGHT") || input.isDown("D")) {
				this.lastDirectionKey = 1;
				if (this.xspeed < 0) {
					if (this.yspeed == 0) {
						this.sprite = this.sprites["slide_left"];
						this.getSprite().frames = [0];
					}
					this.xspeed += this.accelleration * 4 * dt;
					//
					// // Sound-effect
					// if (this._soundtimeout_swoosh <= 0) {
					// 	this._soundtimeout_swoosh = 0.5;
					// 	playSound('sounds/swoosh.mp3');
					// }
				}
				else {
					this.sprite = this.sprites["walk_right"];
					this.getSprite().frames = [0, 1, 2];
					this.xspeed += this.accelleration * dt;
				}
			}
			if (input.isDown("LEFT") || input.isDown("A")) {
				this.lastDirectionKey = 0;
				if (this.xspeed > 0) {
					if (this.yspeed == 0) {
						this.sprite = this.sprites["slide_right"];
						this.getSprite().frames = [0];
					}
					this.xspeed -= this.accelleration * 4 * dt;

					// // Sound-effect
					// if (this._soundtimeout_swoosh <= 0) {
					// 	this._soundtimeout_swoosh = 0.5;
					// 	playSound('sounds/swoosh.mp3');
					// }
				}
				else {
					this.sprite = this.sprites["walk_left"];
					this.getSprite().frames = [0, 1, 2];
					this.xspeed -= this.accelleration * dt;
				}
			}

			if (!input.isDown("RIGHT") && !input.isDown("D") && !input.isDown("LEFT") && !input.isDown("A") && this.yspeed == 0) {
				if (Math.abs(this.xspeed) > 0 && Math.abs(this.xspeed) <= 5) {
					this.xspeed = 0;
				} else if (this.xspeed > 0) {
					this.xspeed -= this.accelleration * 3 * dt;
				} else if (this.xspeed < 0) {
					this.xspeed += this.accelleration * 3 * dt;
				}

				//this._soundtimeout_swoosh = 0;
			}
			if (this.xspeed == 0 && this.yspeed == 0) {
				this.idletime += dt;
				if (this.idletime > 6.0) {
					this.sprite = this.sprites["cheer"];
					this.getSprite().frames = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
				} else {
					if (this.lastDirectionKey == 1) {
						this.sprite = this.sprites["walk_right"];
						this.getSprite().frames = [2];
					} else if (this.lastDirectionKey == 0) {
						this.sprite = this.sprites["walk_left"];
						this.getSprite().frames = [0];
					}
				}
			} else {
				this.idletime = 0;
			}

		//} // end no changing direction in mid-jump

		// Jump
		if (this.yspeed != 0) {
			if (this.getSprite().url == this.sprites["walk_left"].url || this.getSprite().url == this.sprites["walk_right"].url) { this.getSprite().frames = [1]; }
			this.getSprite()._index = 1;
		}
		else if (this.jumptimout > 0) { this.jumptimout -= dt; }

		if (this._iscolliding == true && this.jumptimout <= 0 && (input.isDown("UP") || input.isDown("W"))) {
			this.yspeed += this.jumpstartspeed;
			this.jumptimout = 0.1;

			// Sound-effect
			if (this._soundtimeout_jump <= 0) {
				this._soundtimeout_jump = 0.5;
				playSound('sounds/mario_jump.mp3');
			}
		}

		//if (input.isDown("DOWN") || input.isDown("S")) this.yspeed -= this.accelleration * dt;
	} // !isdead
};


ActorPlayer.prototype.runCollisionSecondaryEffects = function(obstacle){
	if (obstacle._ishostile) {
		if (this.sprite == this.sprites["slash_right"] || this.sprite == this.sprites["slash_left"] || this.sprite == this.sprites["downslash"] || data_hasShield == 1) { obstacle.playDeathEvent(); }
		else { obstacle.runCollisionSecondaryEffects(this); }
    }
};

// ====== DEATH EVENT ======
ActorPlayer.prototype.playDeathEvent = function (instantdeath) {
	// Call this function just before deleting the object from the game
	// e.g.: missiles explode before dying

	if (!this.isdead) {
		this.isdead = true;
		//this.deleteme = true; // default death is instantaneous

		this.ignorecollisions = true;

		if (this.deathtarget) {
			this.xspeed += getRandomInt(-200, 0);
			this.yspeed += getRandomInt(550, 800);
		} else {
			this.xspeed += getRandomInt(-200, 200);
			this.yspeed += getRandomInt(450, 700);
			//this.mass = 3.0;
		}

		this.sprite = this.sprites["death"];

		// Sound-effect
		//playSound('sounds/gunSilencer.mp3');
	}
};
