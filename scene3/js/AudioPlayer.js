window.AudioPlayer = AudioPlayer;

// takes an array of urls as an argument
function AudioPlayer(sounds)
{
    this.sounds = [];
    for (var i in sounds) {
			this.addSound(sounds[i]);
    }
}
AudioPlayer.prototype.addSound = function(sound){
	//this.sounds[sound] = new Audio(sound);

	// SOURCE:  http://stackoverflow.com/questions/11103582/detecting-when-html5-audio-is-finished-playing-more-than-once
	var newSound = new Audio(sound);
	newSound.addEventListener("ended", function(){ 
		//console.log("ended "+sound);
		newSound.pause();
		newSound.currentTime = 0; 
	});
	this.sounds[sound] = newSound;
};
AudioPlayer.prototype.playSound = function(sound){
	// load sound into library if not already loaded
	if (!this.sounds[sound]) {
		this.addSound(sound);
	}
	// play pre-loaded sound from library
	/*
	// stop sound and restart
	//this.sounds[sound].stop(); // stop command does not work (broken)
	this.sounds[sound].pause();
	this.sounds[sound].currentTime = 0;
	this.sounds[sound].play();
	*/

	// make a temporary copy of the sound to play if the main track is currently in use
	if (this.sounds[sound].currentTime > 0) {
		var copySound = new Audio(sound);
		copySound.play();
		//console.log("playing copy of "+sound);
	} else {
		this.sounds[sound].play();
	}
};
AudioPlayer.prototype.stopSound = function(sound, doNotResetSound){
	// stop sound and restart
	//this.sounds[sound].stop(); // stop command does not work (broken)
	this.sounds[sound].pause();
	if (!doNotResetSound) {
		this.sounds[sound].currentTime = 0;
	}
};


