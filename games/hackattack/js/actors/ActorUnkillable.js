//===================== PROTOTYPE ======================
function ActorUnkillable(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart, death_sprite)
{
	Actor.call(this, sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart); // call super constructor.

	this.death_sprite = death_sprite;

    this._ishostile = true;

	this._deathanimationtimeout = 1.5;
}
// ====== WORLD OBJECT ======
// subclass extends superclass
ActorUnkillable.prototype = Object.create(Actor.prototype);
ActorUnkillable.prototype.constructor = ActorUnkillable;


// ====== FUNCTIONS ======
ActorUnkillable.prototype.processControls = function (dt) {
    // Immobile
};

ActorUnkillable.prototype.runCollisionSecondaryEffects = function(obstacle){
	if (obstacle._isplayer) {
        obstacle.playDeathEvent();
		playSound('sounds/fireball_large.mp3');
    }
};

// ====== DEATH EVENT ======
ActorUnkillable.prototype.playDeathEvent = function (instantdeath) {

};
