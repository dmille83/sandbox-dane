//===================== ActorPlayer PROTOTYPE ======================
function Sword(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions)
{
	Actor.call(this, sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions); // call super constructor.
    this.shieldTimeout = 5.0;

    //this.lifespan = 5.0;
}
// ====== WORLD OBJECT ======
// subclass extends superclass
Sword.prototype = Object.create(Actor.prototype);
Sword.prototype.constructor = Sword;


// ====== FUNCTIONS ======
Sword.prototype.processControls = function (dt)
{
    if (data_powerupChosen != 1) {
        this.playDeathEvent();
    }
	// console.log(this.shieldTimeout);
    // if (this.shieldTimeout > 0) {
    //     this.shieldTimeout -= dt;
    // } else {
    //     data_hasShield = 0;
	// 	this.playDeathEvent();
    // }
}

// ====== DEATH EVENT ======
Sword.prototype.playDeathEvent = function (instantdeath) {
	// Call this function just before deleting the object from the game
	// e.g.: missiles explode before dying

	if (!this.isdead) {
		this.isdead = true;
		this.deleteme = true; // default death is instantaneous
	}
};
