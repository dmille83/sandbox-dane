//(function() {

    // Create the canvas
    var canvasSize = 900; //900;
    var canvasScale = canvasSize/1400;
    var canvas = document.getElementById('canvasScreenID'); //document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.style.display='block';
    canvas.style.border='1px solid blue';
    canvas.style.margin='auto';
    //canvas.oncontextmenu=new Function("alert(message);return false"); // ???
    //document.body.appendChild(canvas);
    canvas.style.cursor='none';


    var innerThreshold = 0;
    var outerThreshold = (canvas.height/2) * 0.90;
    

    // Track mouse movement
    var mousePos = {
      x: 0,
      y: 0
    };
    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left - canvas.width/2,
        y: -(evt.clientY - rect.top - canvas.height/2)
      };
    }
    var windowIsFocused = true;
    window.addEventListener('focus', function() {
      windowIsFocused = true;
      mouseIsOver = true;
    });
    window.addEventListener('blur', function() {
      windowIsFocused = false;
      mouseIsOver = false;
      mousePos = {
        x: 0,
        y: 0
      };
    });
    var mouseIsOver = false;
    canvas.addEventListener('mouseover', function(evt) {
      if (windowIsFocused) {
        mouseIsOver = true;
      }
    }, false);
    canvas.addEventListener('mouseout', function(evt) {
      mouseIsOver = false;
      mousePos = {
        x: 0,
        y: 0
      };
    }, false);
    canvas.addEventListener('mousemove', function(evt) {
  	   var tempMousePos = getMousePos(canvas, evt);
       if (getDistance(0, 0, tempMousePos.x, tempMousePos.y) > outerThreshold)
       {
         var tempMousePos2 = getMousePos(canvas, evt);
         tempMousePos.x = Math.sin(getAngle(canvas.width/2, canvas.height/2, canvas.width/2 + tempMousePos2.x, canvas.height/2 + tempMousePos2.y) * TO_RADIANS) * outerThreshold;
         tempMousePos.y = Math.cos(getAngle(canvas.width/2, canvas.height/2, canvas.width/2 + tempMousePos2.x, canvas.height/2 + tempMousePos2.y) * TO_RADIANS) * outerThreshold;
       }

       //setTimeout(function() {
    		if (mouseIsOver)
    		{
    		      mousePos = tempMousePos; //getMousePos(canvas, evt);
    		}
    		else
    		{
    			mousePos = {
    				x: 0,
    				y: 0
    			};
    		}
    	//},50);
    }, false);
    var mouseButtonsDown = [false, false, false, false];
    $(canvas).mousedown(function(event) {
      //event.preventDefault();
      switch (event.which) {
        case 1:
          //alert('Left Mouse button pressed.');
          mouseButtonsDown[1] = true;
          break;
        case 2:
          //alert('Middle Mouse button pressed.');
          mouseButtonsDown[2] = true;
          break;
        case 3:
          //alert('Right Mouse button pressed.');
          mouseButtonsDown[3] = true;
          break;
        default:
          //alert('You have a strange Mouse!');
      }
      //return false;
    });
    $(canvas).mouseup(function(event) {
      switch (event.which) {
        case 1:
          //alert('Left Mouse button released.');
          mouseButtonsDown[1] = false;
          break;
        case 2:
          //alert('Middle Mouse button released.');
          mouseButtonsDown[2] = false;
          break;
        case 3:
          //alert('Right Mouse button released.');
          mouseButtonsDown[3] = false;
          break;
        default:
          //alert('You have a strange Mouse! (up)');
      }
    });




    var data_worldRadius = 300; //150; //2000;
    var data_terrainPattern;
    var data_terrainOffset = 0.8;
    var data_lastUpdateInterval;

    var data_victims = [];
    var data_monsters = [];
	var data_obstacles = [];
    var player;
	
	var terrainPos = { x: 0, y: 0 };
	var playerLastPos = { x: 0, y: 0 };

	var data_maxSpeed = 600;
	 

    function init() {
    	data_terrainPattern = ctx.createPattern(resources.get('sprites/stage.png'), 'repeat');
    	data_lastUpdateInterval = Date.now();
    	main(); // Let's start this show!
    }
    //init(); // Let's start this show!

    // load list of images.
    resources.load([
        'sprites/stage.png',
        'sprites/victim.png',
        'sprites/victim2.png',
        'sprites/monster.png',
        'sprites/monster2.png',
        'sprites/missile.png',
        'sprites/meteor.png'
    ]);
    resources.onReady(init); // To get an image once the game starts, we just do resources.get('img/sprites.png'). Easy!



    function spawnNewVictim() {
        var sprite, x, y, angle, xspeed, yspeed, anglespeed;
        //sprite = new Sprite('sprites/victim.png', [0, 0], [15, 15], 5, [0, 1], 0);
        sprite = new Sprite('sprites/victim2.png', [0, 0], [35, 35], 0, [0], 0);
        x = data_worldRadius - 100;
        y = data_worldRadius - 100;
        angle = 0;
        xspeed = 0;
        yspeed = 0;
        anglespeed = 0; //50;
        var victim = new Victim(sprite, x, y, angle, xspeed, yspeed, anglespeed);
        data_victims.push(victim);
    }
    spawnNewVictim();


    function spawnNewMonster(x, y, spriteImg) {
        var sprite, angle, xspeed, yspeed, anglespeed;
        //sprite = new Sprite('sprites/missile.png', [0, 0], [15, 15], 5, [0, 1], 0);
        //sprite = new Sprite('sprites/monster2.png', [0, 0], [15, 35], 5, [0, 1], 0);
        //sprite = new Sprite(spriteImg, [0, 0], [15, 35], 5, [0, 1], 0);
		sprite = new Sprite(spriteImg, [0, 0], [10, 35], 5, [0, 1], 0);
        angle = 0;
        xspeed = 0;
        yspeed = 0;
        anglespeed = 0;
        var monster = new Monster(sprite, x, y, angle, xspeed, yspeed, anglespeed);
        data_monsters.push(monster);
    }
    spawnNewMonster((data_worldRadius - 40), -(data_worldRadius - 60), 'sprites/monster2.png');
    //spawnNewMonster((data_worldRadius - 60), -(data_worldRadius - 40), 'sprites/missile.png');
	spawnNewMonster((data_worldRadius - 160), -(data_worldRadius - 180), 'sprites/missile.png');
	
	
    function spawnNewObstacle(x, y, spriteImg) {
        var sprite, angle, xspeed, yspeed, anglespeed;
		//sprite = new Sprite('sprites/victim2.png', [0, 0], [35, 35], 0, [0], 0);
		//sprite = new Sprite('sprites/meteor.png', [0, 0], [23, 23], 0, [0], 0);
        sprite = new Sprite(spriteImg, [0, 0], [23, 23], 0, [0], 0);
        angle = 0;
        xspeed = 0;
        yspeed = 0;
        anglespeed = 0;
        var obstacle = new Obstacle(sprite, x, y, angle, xspeed, yspeed, anglespeed);
        data_obstacles.push(obstacle);
    }
	spawnNewObstacle(-(data_worldRadius - 40), -(data_worldRadius - 60), 'sprites/meteor.png');
	//spawnNewObstacle(-40, -40, 'sprites/meteor.png');
	
	
	function getLoopedWorldCoordinates(thisX, thisY, targetX, targetY) 
	{
		var xOffset = targetX;
		var yOffset = targetY;
		//if (getDistance(thisX, thisY, xOffset, yOffset) < getDistance(thisX, thisY, targetX, targetY)) { return [xOffset, yOffset]; }
		
		xOffset = 2*data_worldRadius - Math.abs(getDistance(0, 0, targetX, 0));
		if (targetX > 0) xOffset *= -1;
		//if (getDistance(thisX, thisY, xOffset, yOffset) > getDistance(thisX, thisY, targetX, targetY)) xOffset = targetX;
		if (getDistance(thisX, 0, xOffset, 0) > getDistance(thisX, 0, targetX, 0)) xOffset = targetX;
		
		yOffset = 2*data_worldRadius - Math.abs(getDistance(0, 0, 0, targetY));
		if (targetY > 0) yOffset *= -1;
		//if (getDistance(thisX, thisY, xOffset, yOffset) > getDistance(thisX, thisY, targetX, targetY)) yOffset = targetY;
		if (getDistance(0, thisY, 0, yOffset) > getDistance(0, thisY, 0, targetY)) yOffset = targetY;
		
		//return [xOffset, yOffset];
		return { x: xOffset, y: yOffset };
	}
	
//})();
