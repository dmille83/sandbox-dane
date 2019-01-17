//===================== ActorPlayer PROTOTYPE ======================
function ChromeShield(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions)
{
	Actor.call(this, sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions); // call super constructor.
    this.shieldTimeout = 5.0;

	data_hasShield = 1;

    this.lifespan = 5.0;
}
// ====== WORLD OBJECT ======
// subclass extends superclass
ChromeShield.prototype = Object.create(Actor.prototype);
ChromeShield.prototype.constructor = ChromeShield;


// ====== FUNCTIONS ======
ChromeShield.prototype.processControls = function (dt)
{
	// console.log(this.shieldTimeout);
    // if (this.shieldTimeout > 0) {
    //     this.shieldTimeout -= dt;
    // } else {
    //     data_hasShield = 0;
	// 	this.playDeathEvent();
    // }
	this.x = data_players[0].x;
	this.y = data_players[0].y;
}

// ====== DEATH EVENT ======
ChromeShield.prototype.playDeathEvent = function (instantdeath) {
	// Call this function just before deleting the object from the game
	// e.g.: missiles explode before dying

	if (!this.isdead) {
		this.isdead = true;
		this.deleteme = true; // default death is instantaneous

		data_hasShield = 0;
	}
};
