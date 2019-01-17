//===================== PROTOTYPE ======================
function ActorWorm(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart, death_sprite)
{
	Actor.call(this, sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart); // call super constructor.

	this.death_sprite = death_sprite;

	this.hasPlayedHelloSound = false;

    this._ishostile = true;

	this._deathanimationtimeout = 1.5;
}
// ====== WORLD OBJECT ======
// subclass extends superclass
ActorWorm.prototype = Object.create(Actor.prototype);
ActorWorm.prototype.constructor = ActorWorm;


// ====== GET AND SET ======
ActorWorm.prototype.getWidth = function(){
    switch (this.getSprite()._index) {
        case 0:
            return this.getSprite().size[0]/2 * this.scale;
            break;
        case 1:
            return this.getSprite().size[0]/3 * this.scale;
            break;
        case 2:
            return this.getSprite().size[0]/5 * this.scale;
            break;
        default:
            return this.getSprite().size[0]/5 * this.scale;
    }
};

// ====== FUNCTIONS ======
ActorWorm.prototype.processControls = function (dt) {
    var max = this.getSprite().frames.length;
    var idx = Math.floor(this.getSprite()._index);
    frame = this.getSprite().frames[idx % max];
    if (frame < 1 && this.hasPlayedHelloSound) {
        this.x -= this.getWidth()/2; // 50 * dt;
    }

	if (Math.abs(data_players[0].x - this.x) < this.smart + this.getWidth()) {
		if (this.hasPlayedHelloSound == false) {
			this.hasPlayedHelloSound = true;
			playEnemySound("sounds/alienbug.mp3");
		}
	}
};

ActorWorm.prototype.runCollisionSecondaryEffects = function(obstacle){
	if (obstacle._isplayer) {
        obstacle.playDeathEvent();
		playSound('sounds/fireball_large.mp3');
		playEnemySound('sounds/malfunction.wav');
		//playEnemySound('sounds/die.flac');
    }
};

// ====== DEATH EVENT ======
ActorWorm.prototype.playDeathEvent = function (instantdeath) {
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
		playEnemySound('sounds/fireball_large.mp3');
	}
};
