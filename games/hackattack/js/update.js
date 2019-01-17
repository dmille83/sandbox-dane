
// ================== LOOP (begin) ================== //
// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
	return window.requestAnimationFrame    ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(callback){
			window.setTimeout(callback, 1000 / 60);
		};
})();

// The main game loop
//var data_lastUpdateInterval;
function main() {
	if (!data_gameOver) {
		var now = Date.now();
		var dt = (now - data_lastUpdateInterval) / 1000.0;

	    update(dt);
		render();
		updateMusic(dt); // TODO: re-enable once volume is fixed.

		data_lastUpdateInterval = now;
		requestAnimFrame(main);
	} else if (data_gameWon == true) {
		gameWinnerEvent();
	}
}
//main(); // Let's start this show!


//============================ MUSIC
function updateMusic(dt) {
	if (data_muteMusic) {
		if (data_soundtrackTimeout != 0) {
			data_soundtrackTimeout = 0;
			stopAllMusic();
		}
	} else {
		if (data_soundtrackTimeout > 0) { data_soundtrackTimeout -= dt; }
		else {
			var songIndex = getRandomInt(0, data_soundtracks.length-1);
			if (data_firstMusicRound) {
				data_firstMusicRound = false;
				songIndex = 0;
			}
			data_soundtrackTimeout = data_soundtracks[songIndex].duration;
			playMusic(data_soundtracks[songIndex].music);
		}
	}
}
function playMusic(soundfile) {
	data_audioPlayer.playSound(soundfile);
}
function stopAllMusic() {
	for (var i in data_soundtracks) {
		data_audioPlayer.stopSound(data_soundtracks[i].music);
	}
}

//============================ RENDER
function render() {

	ctx.fillStyle = data_terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height); //ctx.fillRect(0 - playerOffsetX, 0, canvas.width, canvas.height);

	renderStaticEntities(data_icons);
	ctx.globalAlpha = 0.8;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 1.0;

	renderEntities(data_obstacles);
	renderEntities(data_doors);
	renderEntities(data_players);
    renderEntities(data_actors);
	renderStaticEntities(data_recyclebins);

	if (data_alertTextTimeout > 0) { drawTextLine(ctx, [canvas.width/2 - (data_alertText.length*4), 100], data_alertText, 20, "white"); }
	if (data_levelTitleTimeout > 0) { drawTextLine(ctx, [canvas.width/2 - (data_levelTitle.length*8), 50], data_levelTitle, 40, "white"); }

	// for(var i in data_masterarray) {
	// 	renderEntities(data_masterarray[i]);
	// }

	drawTextLine(ctx, [34, 49], data_playerLivesRemaining, 20, "black");
	drawTextLine(ctx, [36, 51], data_playerLivesRemaining, 20, "black");
	drawTextLine(ctx, [35, 50], data_playerLivesRemaining, 20, "white");
	drawTextLine(ctx, [27, 79], "Lives", 13, "black");
	drawTextLine(ctx, [13, 92], "Remaining", 13, "black");
	drawTextLine(ctx, [25, 81], "Lives", 13, "black");
	drawTextLine(ctx, [15, 94], "Remaining", 13, "black");
	drawTextLine(ctx, [26, 80], "Lives", 13, "white");
	drawTextLine(ctx, [14, 93], "Remaining", 13, "white");

	drawTextLine(ctx, [86, 50], "Level " + data_stageSelected, 20, "white");

}
function renderEntities(list)
{
	for(var i=0; i<list.length; i++) {
		renderEntity(list[i]);
	}
}
function renderEntity(actor)
{
    ctx.save();

	var xOffset = canvas.width/2 + actor.x - data_renderOffsetX;
	var yOffset = canvas.height/2 - actor.y + data_renderOffsetY;

	ctx.translate(xOffset, yOffset);
	ctx.rotate((actor.angle) * TO_RADIANS);
	ctx.translate(-actor.getWidth(), -actor.getHeight());
	ctx.scale(actor.scale, actor.scale);
    actor.getSprite().render(ctx);
    //actor.sprite.update(); // ???

    ctx.restore();
}

function renderStaticEntities(list)
{
	for(var i=0; i<list.length; i++) {
		renderStaticEntity(list[i]);
	}
}
function renderStaticEntity(actor)
{
    ctx.save();

	var xOffset = canvas.width/2 + actor.x;
	var yOffset = canvas.height/2 - actor.y;

	ctx.translate(xOffset, yOffset);
	ctx.rotate((actor.angle) * TO_RADIANS);
	ctx.translate(-actor.getWidth(), -actor.getHeight());
	ctx.scale(actor.scale, actor.scale);
    actor.getSprite().render(ctx);
    //actor.sprite.update(); // ???

    ctx.restore();
}

function drawTextLine(ctx, pos, line, fontsize, txColor)
{
	if (!fontsize) fontsize = 10;
	ctx.font = "bold " + fontsize + "px Sans-serif";
	if (txColor) ctx.fillStyle = txColor;
	else ctx.fillStyle = 'white';
	ctx.fillText(line, pos[0], pos[1]);
}



//============================ UPDATE
function update(dt) {
	updateCollisionTargets();

	// Update alert timeout
	if (data_alertTextTimeout > 0) { data_alertTextTimeout -= dt; }
	if (data_levelTitleTimeout > 0) { data_levelTitleTimeout -= dt; }

	// Spawn new "corrupted" icons in background
	if (icoTimeout > 0) { icoTimeout -= dt; }
	else {
		icoTimeout = 3.0;
		spawnNewCorruptedIcons(10);
	}

	if (data_players[0] && !data_players[0].isdead) {

		// X offset slowly resets
		if (data_renderOffsetX > 0) { data_renderOffsetX--; }
		else if (data_renderOffsetX < 0) { data_renderOffsetX++; }
		// X offset
		if (Math.abs(data_players[0].x - data_renderOffsetX) > data_renderOffsetThresholdX) {
			if (data_players[0].x > data_renderOffsetX) {
				data_renderOffsetX = data_players[0].x - data_renderOffsetThresholdX;
			} else {
				data_renderOffsetX = data_players[0].x + data_renderOffsetThresholdX;
			}
		}

		/*
		// Y offset
		if (data_players[0].y > data_renderOffsetY) { data_renderOffsetY++; }
		else if (data_players[0].y < data_renderOffsetY) { data_renderOffsetY--; }
		*/
		// Y offset slowly resets
		if (Math.abs(data_renderOffsetY) < 1) { data_renderOffsetY = 0; }
		else if (data_renderOffsetY > 0) { data_renderOffsetY--; }
		else if (data_renderOffsetY < 0) { data_renderOffsetY++; }
		// Y offset
		if (Math.abs(data_players[0].y - data_renderOffsetY) > data_renderOffsetThresholdY) {
			if (data_players[0].y > data_renderOffsetY) {
				data_renderOffsetY = data_players[0].y - data_renderOffsetThresholdY;
			} else {
				data_renderOffsetY = data_players[0].y + data_renderOffsetThresholdY;
			}
		}

		//console.log("data_renderOffsetY " + (data_renderOffsetY-data_renderOffsetThresholdY) + " data_deathFallHorizon " + (data_deathFallHorizon+data_renderOffsetThresholdY));
		//if (data_renderOffsetY < data_deathFallHorizon + data_renderOffsetThresholdY) { data_renderOffsetY = data_deathFallHorizon + data_renderOffsetThresholdY; }
		if (data_renderOffsetY < canvas.height/2 + data_deathFallHorizon) { data_renderOffsetY = canvas.height/2 + data_deathFallHorizon; }

		// // Update UI element positions
		// for (var i in data_recyclebins) {
		// 	data_recyclebins[i].x = data_renderOffsetX - 557;
		// 	data_recyclebins[i].y = data_renderOffsetY + canvas.height/2 - 40;
		// }
	}


	updateEntities(data_players, dt);
    updateEntities(data_actors, dt);
    updateEntities(data_obstacles, dt);
	updateEntities(data_doors, dt);
	updateEntities(data_recyclebins, dt);
	updateEntities(data_icons, dt);
}
function updateEntities(list, dt)
{
    //for(var i in list)
    for(var i=0; i<list.length; i++) {
        if (list[i].deleteme)
        {
			// Reset level or end game on player death event
			if (list[i]._resetlevelondeath == true) {
				data_powerupChosen = 0;
				data_playerLivesRemaining--;
				if (data_playerLivesRemaining > 0) {
					// reload/restart level
					initLevelSpawn(data_stageSelected);
				} else {
					// end game
					gameOverEvent();
				}
				break;
			}
        	// Have to use BOTH delete methods or actor object will still exist in memory? (memory leak?)
			delete list[i];
			list.splice(i, 1);
        }
        else
		{
			list[i].update(dt, data_worldsize);
		}
    }
}

function updateCollisionTargets()
{
	for(var i in data_players) {
		data_players[i].removeAllTargets();
		data_players[i].setDeathEventTarget(data_recyclebins[0]);
	}
	for(var i in data_actors) {
		data_actors[i].removeAllTargets();
		data_actors[i].setDeathEventTarget(data_recyclebins[0]);
	}
	for(var i in data_obstacles) {
		data_obstacles[i].removeAllTargets();
	}

	for(var i in data_players) {
        for(var j in data_actors) {
            data_players[i].addTarget(data_actors[j]);
        }
        for(var j in data_obstacles) {
            data_players[i].addTarget(data_obstacles[j]);
        }
    }
    for(var i in data_actors) {
		for(var j in data_actors) {
            data_actors[i].addTarget(data_actors[j]);
        }
        for(var j in data_obstacles) {
            data_actors[i].addTarget(data_obstacles[j]);
        }
    }

	for(var i in data_doors) {
		for(var j in data_players) {
			data_doors[i].addTarget(data_players[j]);
		}
	}
}


function gameOverEvent() {
	data_gameOver = true;
	initLevelSpawn(-1);

	var corruptionOverloadInterval = setInterval(function(){
		spawnNewCorruptedIcons(2);
		renderStaticEntities(data_icons); //render();
	}, 500);

	var x=500, y=150;
	setTimeout(function(){
		//clearInterval(corruptionOverloadInterval);

		playSound('sounds/robotlaughing.wav');
		ctx.fillStyle = data_bluescreenPattern;
	    ctx.fillRect(0, 0, canvas.width, canvas.height);

		drawTextLine(ctx, [x-2, y-2], "You've ", 62, "black");
		drawTextLine(ctx, [x, y], "You've ", 60, "red");
		setTimeout(function(){
			drawTextLine(ctx, [x-2, y-2], "You've Been", 62, "black");
			drawTextLine(ctx, [x, y], "You've Been", 60, "red");
			setTimeout(function(){
				drawTextLine(ctx, [x-2, y-2], "You've Been Hacked!", 62, "black");
				drawTextLine(ctx, [x, y], "You've Been Hacked!", 60, "red");
				playSound('sounds/gameover.mp3');

				setTimeout(function(){
					clearInterval(corruptionOverloadInterval);
					data_stageSelected = 0;
					data_playerLivesRemaining = 1;
					data_powerupChosen = 0;
					initLevelSpawn(data_stageSelected);
					data_gameOver = false;
					main();
				}, 3000);

			}, 1000);
		}, 1000);
	}, 2000);
}

function gameWinnerEvent() {
	data_gameOver = true;
	initLevelSpawn(-1);

	ctx.save();
	ctx.fillStyle = "#82FFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.translate(300, 0);
	ctx.fillStyle = data_bannerPattern;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();

	playMusic('sounds/winner.mp3');

	var x=700, y=350;
	setTimeout(function(){
		drawTextLine(ctx, [x-2, y-2], "You've ", 62, "black");
		drawTextLine(ctx, [x, y], "You've ", 60, "#00FF00");
		setTimeout(function(){
			drawTextLine(ctx, [x-2, y-2], "You've Won!", 62, "black");
			drawTextLine(ctx, [x, y], "You've Won!", 60, "#00FF00");
		}, 1000);
	}, 1000);
}


// UTILITY
// SOURCE:  http://stackoverflow.com/questions/8556203/how-do-i-fire-a-javascript-playsound-event-onclick-without-sending-the-user-to-t
function playSound(soundfile) {
	//document.getElementById("dummySoundPlayer").innerHTML = "<embed src=\""+soundfile+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
	data_audioPlayer.playSound(soundfile);
}
function playEnemySound(soundfile) {
	//document.getElementById("dummyEnemySoundPlayer").innerHTML = "<embed src=\""+soundfile+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
	data_audioPlayer.playSound(soundfile);
}
