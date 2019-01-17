//===================== ActorPlayer PROTOTYPE ======================
function Platform001(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions)
{
	Actor.call(this, sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions); // call super constructor.
}
// ====== WORLD OBJECT ======
// subclass extends superclass
Platform001.prototype = Object.create(Actor.prototype);
Platform001.prototype.constructor = Platform001;


// ====== FUNCTIONS ======
Platform001.prototype.processControls = function (dt)
{
    
}
