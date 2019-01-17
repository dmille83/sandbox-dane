//===================== PROTOTYPE ======================
function ActorClickme(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart, death_sprite)
{
	Actor.call(this, sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart); // call super constructor.

	this.death_sprite = death_sprite;

    this._ishostile = true;

	this.hasPlayedHelloSound = false;

	this._deathanimationtimeout = 1.5;
}
// ====== WORLD OBJECT ======
// subclass extends superclass
ActorClickme.prototype = Object.create(Actor.prototype);
ActorClickme.prototype.constructor = ActorClickme;


// ====== FUNCTIONS ======
ActorClickme.prototype.processControls = function (dt) {
    /*
    ?? In your face, but not touching you
    if (Math.abs(data_players[0].x - this.x) < 25 + this.getWidth()) {
        this.xspeed = 0;
	} else if (Math.abs(data_players[0].x - this.x) < this.smart + this.getWidth()) {
        if (data_players[0].x > this.x) { this.xspeed = 50; }
        else { this.xspeed = -50; }
	} else if (!this.isdead) {
        this.xspeed = 0;
    }
    */

    // They only approach when you are looking at them
    if (Math.abs(data_players[0].x - this.x) < this.smart + this.getWidth()) {
        if (data_players[0].lastDirectionKey == 1 && data_players[0].x < this.x) {
            this.xspeed = -50;
        } else if (data_players[0].lastDirectionKey == 0 && data_players[0].x > this.x) {
            this.xspeed = 50;
        } else if (!this.isdead) {
            this.xspeed = 0;
        }
		if (this.xspeed != 0) {
			if (this.hasPlayedHelloSound == false) {
				this.hasPlayedHelloSound = true;
				playEnemySound("sounds/small_footsteps.mp3");
			}
		} else {
			this.hasPlayedHelloSound = false;
		}
    } else if (!this.isdead) {
        this.xspeed = 0;
    }
};

ActorClickme.prototype.runCollisionSecondaryEffects = function(obstacle){
	if (obstacle._isplayer) {
		this.playDeathEvent();
        obstacle.playDeathEvent();
		//playSound('sounds/fireball_large.mp3');
		playSound('sounds/allyourbasearebelongtous.ogg');
    }
};

// ====== DEATH EVENT ======
ActorClickme.prototype.playDeathEvent = function (instantdeath) {
	// Call this function just before deleting the object from the game
	// e.g.: missiles explode before dying

	if (!this.isdead) {
		this.isdead = true;

        this.xspeed = 0;
		this.ignorecollisions = true;
		this.mass = 0;
		this.sprite = this.death_sprite;
		this.scale = 1.2;

		// if (Math.abs(data_players[0].x - this.x) < this.getWidth()) {
		// 	data_players[0].playDeathEvent();
		// }

		// Sound-effect
		//playEnemySound('sounds/gunSilencer.mp3');
		playEnemySound('sounds/fireball_large.mp3');
	}
};
