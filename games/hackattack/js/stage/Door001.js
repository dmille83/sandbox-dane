//===================== Door001 PROTOTYPE ======================
function Door001(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions)
{
	Actor.call(this, sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions); // call super constructor.
	this.dooractivated = false;
}
// ====== WORLD OBJECT ======
// subclass extends superclass
Door001.prototype = Object.create(Actor.prototype);
Door001.prototype.constructor = Door001;


// ====== FUNCTIONS ======
Door001.prototype.updateCollisions = function (dt, worldSize) {
	// Collision halts movement speed before next frame where x and y pos are updated
	for(var i in this._listoftargets) {
		this.getCollision(this._listoftargets[i], dt);
	}
};

Door001.prototype.getCollision = function(obstacle, dt){
	if (Math.abs(this.x - obstacle.x) <= (this.getWidth() + obstacle.getWidth())) {
		if (Math.abs(this.y - obstacle.y) <= (this.getHeight() + obstacle.getHeight())) {
			if (!this.dooractivated && !obstacle.isdead) {
				this.dooractivated = true;
				//alert("Objective reached!");
				playSound('sounds/teleport.mp3');
				data_stageSelected++;
				initLevelSpawn(data_stageSelected);
				return true;
			}
		}
	}
	return false;
};
