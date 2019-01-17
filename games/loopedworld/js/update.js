
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
	var now = Date.now();
	var dt = (now - data_lastUpdateInterval) / 1000.0;

	//if (!isGamePaused) {
		render();
        update(dt);
	//}

	data_lastUpdateInterval = now;
	requestAnimFrame(main);
}
//main(); // Let's start this show!



function render() {
	// Render background
	ctx.save();
	ctx.scale(canvasScale, canvasScale);
	ctx.fillStyle = data_terrainPattern;
	player = data_victims[0];
	//ctx.translate(-player.x*data_terrainOffset, player.y*data_terrainOffset);
	//ctx.fillRect(player.x*data_terrainOffset, -player.y*data_terrainOffset, canvasSize/canvasScale, canvasSize/canvasScale);
	
	var loopedXY = getLoopedWorldCoordinates(player.x, player.y, playerLastPos.x, playerLastPos.y);
	terrainPos.x += player.x - loopedXY.x;
	terrainPos.y += player.y -  loopedXY.y;
	ctx.translate(-terrainPos.x*data_terrainOffset, terrainPos.y*data_terrainOffset);
	ctx.fillRect(terrainPos.x*data_terrainOffset, -terrainPos.y*data_terrainOffset, canvasSize/canvasScale, canvasSize/canvasScale);
	playerLastPos.x = player.x;
	playerLastPos.y = player.y;
	
	ctx.restore();

	
	// Draw console (HUD)
	var xOffset = canvasSize/2 + mousePos.x;
	var yOffset = canvasSize/2 - mousePos.y;
	// Draw mouse target
	var crosshairRadius = 35 * canvasScale;
	ctx.lineWidth = 0.8; //0.3;
	ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
	if (mouseButtonsDown[1] == true) {
		ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
	}
	if (mouseButtonsDown[3] == true) {
		ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
	}
	ctx.beginPath();
	ctx.arc(xOffset, yOffset, crosshairRadius, 0, 2 * Math.PI, false);
	// Draw cross-hairs
	var crossHairEdgeLength = crosshairRadius - crosshairRadius*0.5; // 65
	ctx.moveTo(xOffset, yOffset - crossHairEdgeLength);
	ctx.lineTo(xOffset, yOffset + crossHairEdgeLength);
	ctx.moveTo(xOffset - crossHairEdgeLength, yOffset);
	ctx.lineTo(xOffset + crossHairEdgeLength, yOffset);
	ctx.stroke();
	// Draw directional line
	ctx.lineWidth = 1;
	// Laser beam
	if (mouseButtonsDown[1] == true) {
		ctx.lineWidth = 3;
	}
	if (mouseButtonsDown[3] == true) {
		ctx.lineWidth = 3;
	}
	//ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
	ctx.beginPath();
	//ctx.moveTo(canvasSize/2, canvasSize/2);
	ctx.moveTo(canvasSize/2 + Math.sin(player.angle * TO_RADIANS) * 20, canvasSize/2 - Math.cos(player.angle * TO_RADIANS) * 20);
	ctx.lineTo(xOffset, yOffset);
	ctx.stroke();
	// Draw a ball-cap at the end of the directional line
	ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
	ctx.beginPath();
	ctx.arc(xOffset, yOffset, 2, 0, 2 * Math.PI, false);
	ctx.fill();


	/*
	// Draw event horizon
	ctx.save();
	ctx.translate(canvasSize/2 - player.x, canvasSize/2 + player.y);
	ctx.lineWidth = 0.4; //0.2;
	ctx.strokeStyle = '#0000ff';
	ctx.fillStyle = 'rgba(0, 0, 0, 0.68)';
	ctx.beginPath();
	ctx.rect(-data_worldRadius, -data_worldRadius, data_worldRadius*2, data_worldRadius*2);
	//ctx.rect(-(data_worldRadius + canvasSize), -(data_worldRadius + canvasSize), (data_worldRadius + canvasSize)*2, (data_worldRadius + canvasSize)*2);
	ctx.stroke();
	//ctx.fill();
	ctx.restore();
	*/
	
	
	// Draw event horizon
	ctx.save();
	ctx.translate(canvasSize/2 - player.x, canvasSize/2 + player.y);
	ctx.lineWidth = 1.0; //0.4;
	ctx.strokeStyle = '#0000ff';
	ctx.fillStyle = 'rgba(0, 0, 0, 0.68)';
	
	ctx.beginPath();
	ctx.rect(-data_worldRadius, -data_worldRadius, data_worldRadius*2, data_worldRadius*2); // center
	ctx.stroke();
	
	ctx.beginPath();
	ctx.lineWidth = 0.2; //0.4;
	for (var i = -3; i <= 4; i+=2) {
		for (var j = -3; j <= 4; j+=2) {
			ctx.rect(i*data_worldRadius, j*data_worldRadius, data_worldRadius*2, data_worldRadius*2);
		}
	}
	ctx.stroke();
	
	ctx.restore();




	// Render Actors
	renderEntities(data_victims);
	renderEntities(data_monsters);
	renderEntities(data_obstacles);



	// Draw inner ring
	ctx.lineWidth = 0.3;
	ctx.strokeStyle = '#ddd';
	ctx.beginPath();
	ctx.arc(canvasSize/2, canvasSize/2, (innerThreshold), 0, 2 * Math.PI, false);
	ctx.stroke();
	// Draw outer ring
	ctx.beginPath();
	ctx.arc(canvasSize/2, canvasSize/2, (outerThreshold), 0, 2 * Math.PI, false);
	ctx.stroke();
	// draw a circle with a hole in it
	ctx.beginPath();
	ctx.arc(canvasSize/2, canvasSize/2, outerThreshold, 0, 2*Math.PI);
	ctx.arc(canvasSize/2, canvasSize/2, (Math.sqrt(canvasSize*canvasSize + canvasSize*canvasSize) - outerThreshold), 0, 2*Math.PI, true);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.68)';
	ctx.fill();
}
function renderEntities(list)
{
	for(var i=0; i<list.length; i++) {
		renderEntity(list[i]);
	}
}
function renderEntity(actor)
{
	actor.render();
}



function update(dt) {
    updateEntities(data_victims, dt);
    updateEntities(data_monsters, dt);
	updateEntities(data_obstacles, dt);
}
function updateEntities(list, dt)
{
    //for(var i in list)
    for(var i=0; i<list.length; i++) {
        if (list[i].killme)
        {
            // Have to use BOTH delete methods or actor object will still exist in memory? (memory leak?)
			delete list[i];
			list.splice(i, 1);
        }
        else
		{
			addTargets(list[i]);
			list[i].update(dt, data_worldRadius);
		}
    }
	
	/*
	for(var i in data_victims) data_victims[i].feedListOfTargets(data_monsters);
	for(var i in data_monsters) data_monsters[i].feedListOfTargets(data_victims);
	//for(var i in data_monsters) data_monsters[i].feedListOfTargets(data_monsters);
	for(var i in data_obstacles) data_victims[i].feedListOfTargets(data_monsters);
	for(var i in data_obstacles) data_victims[i].feedListOfTargets(data_victims);
	*/
}



function addTargets(target)
{
	target._listoftargets = [];
	target.feedListOfTargets(data_monsters);
	target.feedListOfTargets(data_victims);
	target.feedListOfTargets(data_obstacles);
}

