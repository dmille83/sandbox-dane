window.AudioPlayer = AudioPlayer;

// takes an array of urls as an argument
function AudioPlayer(sounds)
{
    this.sounds = [];
    for (var i in sounds) {
        this.sounds[sounds[i]] = new Audio(sounds[i]);
        //this.sounds.push(new Audio(sounds[i]));
    }
}
AudioPlayer.prototype.playSound = function(sound){
    if (!this.sounds[sound]) {
        // load sound into library if not already loaded
        this.sounds[sound] = new Audio(sound);
    }
    //this.sounds[sound].stop();
    this.sounds[sound].pause();
    this.sounds[sound].currentTime = 0;
	 this.sounds[sound].play();

    // if (this.sounds.indexOf(sound) == -1) {
    //     // load sound into library if not already loaded
    //     this.sounds.push(new Audio(sound));
    // }
	// this.sounds[this.sounds.indexOf(sound)].play();
};
