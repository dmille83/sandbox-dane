//===================== PROTOTYPE ======================
function ActorPowerup(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart, powerup)
{
	Actor.call(this, sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart); // call super constructor.

    this.powerup = powerup;

    this._ishostile = true;

	this._deathanimationtimeout = 1.5;
}
// ====== WORLD OBJECT ======
// subclass extends superclass
ActorPowerup.prototype = Object.create(Actor.prototype);
ActorPowerup.prototype.constructor = ActorClickme;


// ====== FUNCTIONS ======
ActorPowerup.prototype.processControls = function (dt) {
    // immobile
};

ActorPowerup.prototype.runCollisionSecondaryEffects = function(obstacle){
	if (obstacle._isplayer) {
        switch (this.powerup) {
            case 1:
				setTimeout(function(){
                	data_powerupChosen = 1;
					spawnNewSword();
				}, 1500);
				showAlertText("POWERUP: PRESS SPACE TO ATTACK!", 2.0);
				playSound('sounds/swords_clash.mp3');
                break;
            case 2:
				//setTimeout(function(){
                	//data_hasShield = 1;
					spawnNewShield();
				//}, 1500);
				showAlertText("TEMPORARY INVULNERABILITY!", 2.0);
				playEnemySound('sounds/wub-wub-wub.mp3');
                break;
            default:
				setTimeout(function(){
                	data_playerLivesRemaining++;
				}, 1500);
				showAlertText("BONUS LIFE!", 2.0);
				playEnemySound('sounds/repairscompleted.wav');
        }
		obstacle.lastDirectionKey = -1; // disable auto-still
		obstacle.poweruptimout = 0.75;
		obstacle.sprite = obstacle.sprites["cheer"];
		obstacle.getSprite().frames = [0, 1];
        this.playDeathEvent();
    }
};
