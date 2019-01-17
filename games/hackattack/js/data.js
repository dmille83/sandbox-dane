//(function() {

    // Create the canvas
    var canvas = document.getElementById('canvasScreenID'); //document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 1200;
    canvas.height = 600;
    canvas.style.display='block';
    canvas.style.border='1px solid blue';
    canvas.style.margin='auto';
    //document.body.appendChild(canvas);


    // Global variables
    var data_gravity = -9.8;
    var data_worldsize = 300; // TODO: remove me?
    var data_lastUpdateInterval;
    var data_terrainPattern;
    var data_bluescreenPattern;
    var data_bannerPattern;
    var icoTimeout = 0;

    // Resource arrays
    var widePlatformSprites = [];
    var smallPlatformSprites = [];

    // Actor arrays
    var data_players = [];
    var data_actors = [];
    var data_obstacles = [];
    var data_doors = [];
    var data_recyclebins = [];
    var data_icons = [];

    // Global game variables
    var data_stageSelected = 0; // TODO: set to 0
    var data_playerLivesRemaining = 1; // 3
    var data_powerupChosen = 0; // Mouse // TODO: set to 0
    var data_hasShield = 0; // Chrome Shield
    var data_deathFallHorizon = -canvas.height; //-canvas.height/2;
    var data_gameOver = false;
    var data_gameWon = false;

    // Global rendering variables
    var data_renderOffsetCenter = -100;
    var data_renderOffsetThresholdX = 100;
    var data_renderOffsetX = 0;
    data_renderOffsetThresholdY = 100; //canvas.height - 100;
    var data_renderOffsetY = 0;

    // Soundtracks
    var data_soundtrackTimeout = 0.0;
    var data_firstMusicRound = true;
    var data_muteMusic = false;
    var data_soundtracks = [
        {
            music: "sounds/music/background001.mp3",
            duration: 87.0
        },
        {
            music: "sounds/music/background002.mp3",
            duration: 108.0
        }
    ];




    function init() {
        data_terrainPattern = ctx.createPattern(resources.get('sprites/stage/Stage0001.png'), 'repeat');
        data_bluescreenPattern = ctx.createPattern(resources.get('sprites/stage/bluescreen.png'), 'repeat');
        data_bannerPattern = ctx.createPattern(resources.get('sprites/stage/Banner.png'), 'no-repeat');
        initPlatformSprites();
        spawnNewRecycleBin();
        initLevelSpawn(data_stageSelected);

    	ctx.save();
    	ctx.fillStyle = "#82FFFF";
    	ctx.fillRect(0, 0, canvas.width, canvas.height);
    	ctx.translate(300, 0);
    	ctx.fillStyle = data_bannerPattern;
    	ctx.fillRect(0, 0, canvas.width, canvas.height);
    	ctx.restore();

    	//playMusic('sounds/winner.mp3');
        updateMusic(0);

    	setTimeout(function(){
        	data_lastUpdateInterval = Date.now();
            main(); // Let's start this show!
        }, 4000);
    }

    var data_audioPlayer = new AudioPlayer([
        "sounds/small_footsteps.mp3",
        "sounds/gunSilencer.mp3",
        "sounds/allyourbasearebelongtous.ogg",
        "sounds/fireball_large.mp3",
        "sounds/sword_swoosh.wav",
        "sounds/sword_thud.mp3",
        "sounds/mario_jump.mp3",
        "sounds/swords_clash.mp3",
        "sounds/wub-wub-wub.mp3",
        "sounds/repairscompleted.wav",
        "sounds/recharging.mp3",
        "sounds/alienbug.mp3",
        "sounds/malfunction.wav",
        "sounds/robotlaughing.wav",
        "sounds/gameover.mp3",
        "sounds/music/background001.mp3",
        "sounds/music/background002.mp3",
        "sounds/winner.mp3",
		  "sounds/beepbeep.mp3"
    ]);

    // load list of images.
    resources.load([
        'sprites/stage/Stage0001.png',
        'sprites/stage/Icons.png',
        'sprites/stage/icons_infected.png',
        'sprites/stage/recyclebin.ico',
        'sprites/stage/bluescreen.png',
        'sprites/stage/Banner.png',

        'sprites/stage/Block0002.png',
        'sprites/stage/Block0003.png',
        'sprites/stage/Block1000.png',
        'sprites/stage/Block1001.png',
        'sprites/stage/Block1002.png',
        'sprites/stage/Block1003.png',
        'sprites/stage/Block1004.png',
        'sprites/stage/Block1005.png',
        'sprites/stage/Block1006.png',
        'sprites/stage/Block1007.png',
        'sprites/stage/Block1008.png',
        'sprites/stage/Block1009.png',
        'sprites/stage/Block1010.png',
        'sprites/stage/Block1011.png',
        'sprites/stage/Block1012.png',
        'sprites/stage/Block1013.png',
        'sprites/stage/Block1014.png',
        'sprites/stage/Block1015.png',
        'sprites/stage/Block1016.png',

        'sprites/stage/Block2000.png',
        'sprites/stage/Block2001.png',

        'sprites/player/walk_left.png',
        'sprites/player/walk_right.png',
        'sprites/player/slide_left.png',
        'sprites/player/slide_right.png',
        'sprites/player/slash.png',
        'sprites/player/slash_right.png',
        'sprites/player/slash_left.png',
        'sprites/player/downslash.png',
        'sprites/player/cheer.png',
        'sprites/player/death.png',

        'sprites/enemies/virus001.png',
        'sprites/enemies/ClickmeSign.png',
        'sprites/enemies/orbGreen001.png',
        'sprites/enemies/Worm.png',
        'sprites/enemies/AlertSpike.png',
        'sprites/enemies/admin001.png',
        'sprites/enemies/helpdesk.png',
        'sprites/enemies/mouse.png',
        'sprites/enemies/ChromeShield.png',
        'sprites/enemies/explosion.png',
        'sprites/enemies/explosion_green.png'
    ]);
    resources.onReady(init); // To get an image once the game starts, we just do resources.get('img/sprites.png'). Easy!

    function initPlatformSprites() {
        widePlatformSprites.push( new Sprite('sprites/stage/Block0002.png', [0, 0], [1920, 1080], 5, [0], 0) );
        widePlatformSprites.push( new Sprite('sprites/stage/Block0003.png', [0, 0], [1920, 1080], 5, [0], 0) );

        smallPlatformSprites.push( new Sprite('sprites/stage/Block1000.png', [0, 0], [1539, 867], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1001.png', [0, 0], [727, 753], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1002.png', [0, 0], [1235, 713], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1003.png', [0, 0], [700, 320], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1004.png', [0, 0], [958, 317], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1005.png', [0, 0], [893, 214], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1006.png', [0, 0], [659, 406], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1007.png', [0, 0], [378, 444], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1008.png', [0, 0], [775, 629], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1009.png', [0, 0], [440, 249], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1010.png', [0, 0], [501, 400], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1011.png', [0, 0], [501, 400], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1012.png', [0, 0], [360, 214], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1013.png', [0, 0], [315, 314], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1014.png', [0, 0], [670, 453], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1015.png', [0, 0], [500, 294], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block1016.png', [0, 0], [480, 331], 5, [0], 0) );

        smallPlatformSprites.push( new Sprite('sprites/stage/Block2000.png', [0, 0], [698, 43], 5, [0], 0) );
        smallPlatformSprites.push( new Sprite('sprites/stage/Block2001.png', [0, 0], [43, 698], 5, [0], 0) );
    }


    function spawnNewActorPlayer(x, y) {
        var sprites, sprite_walk_left, sprite_walk_right, xspeed, yspeed;

        sprites = [];
        sprites["walk_left"] = new Sprite('sprites/player/walk_left.png', [0, 0], [20, 52], 5, [0, 1, 2], 0);
        sprites["walk_right"] = new Sprite('sprites/player/walk_right.png', [0, 0], [20, 52], 5, [0, 1, 2], 0);
        sprites["slide_left"] = new Sprite('sprites/player/slide_left.png', [0, 0], [25, 43], 5, [0], 0);
        sprites["slide_right"] = new Sprite('sprites/player/slide_right.png', [0, 0], [25, 43], 5, [0], 0);
        sprites["slash_right"] = new Sprite('sprites/player/slash_right.png', [0, 0], [40, 52], 15, [0, 1, 2, 3], 0, true);
        sprites["slash_left"] = new Sprite('sprites/player/slash_left.png', [0, 0], [40, 52], 15, [3, 2, 1, 0], 0, true);
        sprites["downslash"] = new Sprite('sprites/player/downslash.png', [0, 0], [27, 48], 5, [0, 1, 2, 3], 0, true);
        sprites["cheer"] = new Sprite('sprites/player/cheer.png', [0, 0], [27, 52], 5, [0, 1], 0);
        sprites["death"] = new Sprite('sprites/player/death.png', [0, 0], [60, 64], 10, [0, 1, 2, 3], 0);

        xspeed = 0;
        yspeed = 0;
        var newActorPlayer = new ActorPlayer(sprites, x, y, xspeed, yspeed);
        data_players.push(newActorPlayer);
    }
    //spawnNewActorPlayer(-575, -174); // Bottom left corner

    var data_alertText = "";
    var data_alertTextTimeout = 0;
    function showAlertText(myText, textTimout) {
        data_alertText = myText;
        data_alertTextTimeout = textTimout;
    }

    var data_levelTitle = "";
    var data_levelTitleTimeout = 0;
    function showLevelTitle(myText, textTimout) {
        data_levelTitle = myText;
        data_levelTitleTimeout = textTimout;
    }


    function spawnNewEnemy(x, y, enemyIndex) {
        switch (enemyIndex) {
            case 1:
                // ClickmeSign
                var sprite, death_sprite, xspeed, yspeed, scale, mass, ignorecollisions, smart;
                sprite = new Sprite('sprites/enemies/ClickmeSign.png', [0, 0], [30, 24], 5, [0, 1, 2, 3], 0);
                death_sprite = new Sprite('sprites/enemies/explosion.png', [0, 0], [128, 128], 25, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0, true);
                xspeed = 0;
                yspeed = 0;
                scale = 1.0; //getRandomArbitrary(0.1, 0.3);
                mass = 1.0;
                ignorecollisions = false;
                smart = 250;
                var brick = new ActorClickme(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart, death_sprite);
                data_actors.push(brick);
                break;


            case 2:
                // Alert Spike
                var sprite, death_sprite, xspeed, yspeed, scale, mass, ignorecollisions, smart;
                sprite = new Sprite('sprites/enemies/AlertSpike.png', [0, 0], [27, 20], 5, [0, 1, 2, 3], 0);
                death_sprite = new Sprite('sprites/enemies/explosion.png', [0, 0], [128, 128], 25, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0, true);
                xspeed = 0;
                yspeed = 0;
                scale = 1.0; //getRandomArbitrary(0.1, 0.3);
                mass = 0;
                ignorecollisions = false;
                smart = 0;
                sprite._index = getRandomInt(0, 3);
                var brick = new ActorUnkillable(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart, death_sprite);
                data_actors.push(brick);
                break;


            case 3:
                // Worm
                var sprite, death_sprite, xspeed, yspeed, scale, mass, ignorecollisions, smart;
                sprite = new Sprite('sprites/enemies/Worm.png', [0, 0], [19, 5], 5, [0, 1, 2, 3], 0);
                death_sprite = new Sprite('sprites/enemies/explosion.png', [0, 0], [128, 128], 25, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0, true);
                xspeed = 0;
                yspeed = 0;
                scale = 3.0; //getRandomArbitrary(0.1, 0.3);
                mass = 1.0;
                ignorecollisions = false;
                smart = 300;
                sprite._index = getRandomInt(0, 3);
                var brick = new ActorWorm(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart, death_sprite);
                data_actors.push(brick);
                break;


            case 4:
                // Powerup (bonus life)
                var sprite, death_sprite, xspeed, yspeed, scale, mass, ignorecollisions, smart, powerup;
                sprite = new Sprite('sprites/enemies/helpdesk.png', [0, 0], [40, 70], 5, [0, 1, 2, 3], 0);
                xspeed = 0;
                yspeed = 0;
                scale = 1.0;
                mass = 1.0;
                ignorecollisions = false;
                smart = 0;
                powerup = 0;
                var brick = new ActorPowerup(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart, powerup);
                data_actors.push(brick);
                break;


            case 5:
                // Powerup (mouse sword)
                var sprite, death_sprite, xspeed, yspeed, scale, mass, ignorecollisions, smart, powerup;
                sprite = new Sprite('sprites/enemies/mouse.png', [0, 0], [35, 35], 5, [0], 0);
                xspeed = 0;
                yspeed = 0;
                scale = 1.0;
                mass = 1.0;
                ignorecollisions = false;
                smart = 0;
                powerup = 1;
                var brick = new ActorPowerup(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart, powerup);
                data_actors.push(brick);
                break;


            case 6:
                // Powerup (chrome shield)
                var sprite, death_sprite, xspeed, yspeed, scale, mass, ignorecollisions, smart, powerup;
                sprite = new Sprite('sprites/enemies/ChromeShield.png', [0, 0], [37, 38], 5, [0], 0);
                xspeed = 0;
                yspeed = 0;
                scale = 1.0;
                mass = 1.0;
                ignorecollisions = false;
                smart = 0;
                powerup = 2;
                var brick = new ActorPowerup(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart, powerup);
                data_actors.push(brick);
                break;


            default:
                // POPPERS
                var sprite, death_sprite, xspeed, yspeed, scale, mass, ignorecollisions, smart;
                sprite = new Sprite('sprites/enemies/virus001.png', [0, 0], [237, 280], 5, [0, 1, 2, 3], 0);
                death_sprite = new Sprite('sprites/enemies/explosion_green.png', [0, 0], [128, 128], 25, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0, true);
                xspeed = 0;
                yspeed = 0;
                scale = getRandomArbitrary(0.1, 0.3);
                mass = 1.0;
                ignorecollisions = false;
                smart = 50;
                var brick = new ActorVirus001(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions, smart, death_sprite);
                data_actors.push(brick);
        }
    }

    function spawnNewWidePlatform(x, y, spriteIndex, isCeiling) {
        var sprite, xspeed, yspeed, scale, mass, ignorecollisions;
        if (typeof spriteIndex !== "undefined" && spriteIndex <= widePlatformSprites.length-1) {
            sprite = widePlatformSprites[spriteIndex].getCopy();
        } else {
            sprite = widePlatformSprites[getRandomInt(0, widePlatformSprites.length-1)].getCopy();
        }
        x = x + sprite.size[0]/2;
        if (isCeiling) { y = y + sprite.size[1]/2; }
        else { y = y - sprite.size[1]/2; }
        xspeed = 0;
        yspeed = 0;
        scale = 1.0; //getRandomArbitrary(0.1, 0.3);
        mass = 0;
        ignorecollisions = false;
        var brick = new Platform001(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions);
        data_obstacles.push(brick);
    }
    function spawnNewSmallPlatform(x, y, spriteIndex, isCeiling) {
        var sprite, xspeed, yspeed, scale, mass, ignorecollisions;
        if (typeof spriteIndex !== "undefined" && spriteIndex <= smallPlatformSprites.length-1) {
            sprite = smallPlatformSprites[spriteIndex].getCopy();
        } else {
            sprite = smallPlatformSprites[getRandomInt(0, smallPlatformSprites.length-1)].getCopy();
        }
        x = x + sprite.size[0]/2;
        if (isCeiling) { y = y + sprite.size[1]/2; }
        else { y = y - sprite.size[1]/2; }
        xspeed = 0;
        yspeed = 0;
        scale = 1.0; //getRandomArbitrary(0.1, 0.3);
        mass = 0;
        ignorecollisions = false;
        var brick = new Platform001(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions);
        data_obstacles.push(brick);
    }

    function spawnNewDoor(x, y) {
        var sprite, xspeed, yspeed, scale, mass, ignorecollisions;
        sprite = new Sprite('sprites/stage/Icons.png', [0, 0], [65, 76], 5, [6], 0);
        x = x + sprite.size[0]/2;
        y = y + sprite.size[1]/2;
        xspeed = 0;
        yspeed = 0;
        scale = 1.3; //getRandomArbitrary(0.1, 0.3);
        mass = 0;
        ignorecollisions = false;
        var brick = new Door001(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions);
        data_doors.push(brick);
    }

    function spawnNewShield() {
        var sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions;
        sprite = new Sprite('sprites/enemies/ChromeShield.png', [0, 0], [37, 38], 5, [0, 0, 1], 0);
        x = (-canvas.width/2 + 15) + sprite.size[0]/2;
        y = (canvas.height/2 - 70) + sprite.size[1]/2;
        xspeed = 0;
        yspeed = 0;
        scale = 1.3; //getRandomArbitrary(0.1, 0.3);
        mass = 0;
        ignorecollisions = true;
        var brick = new ChromeShield(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions);
        data_actors.push(brick);
    }

    function spawnNewSword() {
        var sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions;
        sprite = new Sprite('sprites/enemies/mouse.png', [0, 0], [35, 35], 5, [0], 0);
        x = -(canvas.width/2 - 23) + sprite.size[0]/2;
        y = (canvas.height/2 - 60) + sprite.size[1]/2;
        xspeed = 0;
        yspeed = 0;
        scale = 1.3; //getRandomArbitrary(0.1, 0.3);
        mass = 0;
        ignorecollisions = true;
        var brick = new Sword(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions);
        data_recyclebins.push(brick);
    }

    function spawnNewRecycleBin() {
        var sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions;
        //sprite = new Sprite('sprites/stage/Icons.png', [0, 0], [65, 76], 5, [1], 0);
        sprite = new Sprite('sprites/stage/recyclebin.ico', [0, 0], [55, 55], 0, [0], 0);
        x = (-canvas.width/2 + 15) + sprite.size[0]/2;
        y = (canvas.height/2 - 70) + sprite.size[1]/2;
        xspeed = 0;
        yspeed = 0;
        scale = 1.0; //getRandomArbitrary(0.1, 0.3);
        mass = 0;
        ignorecollisions = true;
        var brick = new Platform001(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions);
        data_recyclebins.push(brick);
    }

    function spawnNewIcon(x, y) {
        var sprite, xspeed, yspeed, scale, mass, ignorecollisions;
        var i = getRandomInt(0, 6);
        sprite = new Sprite('sprites/stage/icons_infected.png', [0, 0], [40, 40], 1, [i], 0);
        x = x + sprite.size[0]/2;
        y = y + sprite.size[1]/2;
        xspeed = 0;
        yspeed = 0;
        scale = 1.8; //getRandomArbitrary(0.1, 0.3);
        mass = 0;
        ignorecollisions = true;
        var brick = new Platform001(sprite, x, y, xspeed, yspeed, scale, mass, ignorecollisions);
        data_icons.push(brick);
    }
    function spawnNewCorruptedIcons(spawnChance) {
        data_icons = [];
        var sChance = 10;
        if (spawnChance > 0) { sChance = spawnChance; }

        var x, y;
        var icoSpacing = 103;
        var icoIntervalY = canvas.height/icoSpacing;
        var icoIntervalX = canvas.width/icoSpacing;
        for (var i = 0; i < icoIntervalY; i++) {
            for (var j = 1; j < icoIntervalX; j++) {
                if (i==0 && j==1) {}
                else if (getRandomInt(0, 100) < sChance) {
                    y = canvas.height/2 - i * icoSpacing - icoSpacing/2 - 10;
                    x = -canvas.width/2 + j * icoSpacing + icoSpacing/2 - 35;
                    spawnNewIcon(x, y);
                }
            }
        }
    }


    function initLevelSpawn(levelID) {
        // Reset actor arrays

        data_hasShield = 0;
        data_players = [];
        data_actors = [];
        data_obstacles = [];
        data_doors = [];
        //data_recyclebins = [];
        data_icons = [];

        data_deathFallHorizon = -canvas.height;

        //levelID = 2; // TODO: temp, for level testing!

        // Recycle Bin (for the death animation)
        if (levelID != -1) {
            //spawnNewRecycleBin();

            if (data_powerupChosen == 1) {
                spawnNewSword();
            }

            spawnNewCorruptedIcons(10);
        }

        loadLevel(levelID);
    }

//})();
