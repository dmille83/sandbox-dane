function loadLevel(levelID)
{
    // Populate levels in the following order:
    // Stage
    //   platforms
    //   blocks
    //   door
    // Actors
    //   enemies
    //   player


    // Create the level
    switch (levelID) {
        case -1:
            break;

        case 0:
            var levelTitle = "Training Grounds";
            showLevelTitle("Level "+levelID+": "+levelTitle,3);
            showAlertText("Use WASD or arrow-keys to move", 3.0);

            var startingElevation = 100; // -164;
            // Stage
            //   blocks
            spawnNewSmallPlatform(-600, startingElevation, 15);
            spawnNewEnemy(-83, startingElevation-290, 2);
            spawnNewSmallPlatform(-65, startingElevation, 18);
            spawnNewEnemy(-3, startingElevation-290, 2);
            spawnNewSmallPlatform(20, startingElevation, 13);
            spawnNewSmallPlatform(-200, startingElevation-290, 12);
            //   door
            spawnNewDoor(235, startingElevation-15);
            // Player
            spawnNewActorPlayer(-560, startingElevation+27);
            break;



        case 1:
            var levelTitle = "Bonus Life";
            showLevelTitle("Level "+levelID+": "+levelTitle,3);
            showAlertText("Call the Helpdesk!", 2.0);

            var startingElevation = -50; // -164;
            // Stage
            //   blocks
            spawnNewSmallPlatform(-800, startingElevation, 5);
            spawnNewEnemy(-225, startingElevation+7, 4);
            spawnNewSmallPlatform(225, startingElevation+50, 7);
            //   door
            spawnNewDoor(535, startingElevation-15 + 50);
            // Player
            spawnNewActorPlayer(-585, startingElevation+27);
            break;



        case 2:
            var levelTitle = "The (Exploding) Slime-and-Ball Pit";
            showLevelTitle("Level "+levelID+": "+levelTitle,3);
            showAlertText("Beep beep beep BOOM!", 2.0);

            var startingElevation = -100; // -164;
            // Stage
            //   platforms
            spawnNewWidePlatform(-1085, startingElevation);
            spawnNewWidePlatform(900, startingElevation);
            //   blocks
            spawnNewSmallPlatform(-985, startingElevation+200, 16);
            //   door
            spawnNewDoor(800 + 535, startingElevation-15);
            spawnNewWidePlatform(800 + 735, startingElevation+250, 0);
            // Actors
            //   enemies
            spawnNewEnemy(-400, startingElevation + getRandomInt(0, 200), 0);
            var spawnRandomEnemyCount = getRandomInt(5, 10)
            for (var i = 0; i < spawnRandomEnemyCount; i++) {
                spawnNewEnemy(0 + getRandomInt(-100, 600), startingElevation + getRandomInt(0, 200), 0);
            }
            //   player
            spawnNewActorPlayer(-585, startingElevation+227);
            break;



        case 3:
            var levelTitle = "Hyperlinks";
            showLevelTitle("Level "+levelID+": "+levelTitle,3);
            showAlertText("Look at me! CLICK on me!", 2.0);

            var startingElevation = -100; // -164;
            // Stage
            //   platforms
            //   blocks
            spawnNewWidePlatform(-100, startingElevation, 0);
            spawnNewEnemy(755, startingElevation+27, 1);
            spawnNewEnemy(1200, startingElevation+27, 1);
            //   door
            spawnNewDoor(1725, startingElevation-15);
            // Actors
            //   enemies
            //   player
            spawnNewActorPlayer(0, startingElevation+27);
            break;



        case 4:
            var levelTitle = "Burning Alerts";
            showLevelTitle("Level "+levelID+": "+levelTitle,3);
            showAlertText("Ow ow hot hot HOT!", 2.0);

            var startingElevation = -100; // -164;
            // Stage
            //   platforms
            //   blocks
            spawnNewSmallPlatform(-300, startingElevation+200, 6);
            spawnNewSmallPlatform(425, startingElevation, 11);
            spawnNewEnemy(625, startingElevation, 2);
            spawnNewEnemy(655, startingElevation, 2);
            spawnNewEnemy(685, startingElevation, 2);
            spawnNewEnemy(715, startingElevation, 2);
            spawnNewSmallPlatform(1025, startingElevation, 12);
            spawnNewEnemy(1170, startingElevation, 2);
            spawnNewEnemy(1210, startingElevation, 2);
            //   door
            spawnNewDoor(1325, startingElevation-15);
            // Actors
            //   enemies
            //   player
            spawnNewActorPlayer(0, startingElevation+227);
            break;



        case 5:
            var levelTitle = "Worms";
            showLevelTitle("Level "+levelID+": "+levelTitle,3);
            showAlertText("All your base are belong to us!", 2.0);

            var startingElevation = 0; // -164;
            // Stage
            //   platforms
            spawnNewWidePlatform(-600, startingElevation);
            //   blocks
            spawnNewEnemy(685, startingElevation+27, 3);
            spawnNewEnemy(1100, startingElevation+27, 3);
            //spawnNewEnemy(1300, startingElevation+27, 3);
            //   door
            spawnNewDoor(1225, startingElevation-15);
            // Actors
            //   player
            spawnNewActorPlayer(0, startingElevation+27);
            break;


        case 6:
            var levelTitle = "Combat Training";
            showLevelTitle("Level "+levelID+": "+levelTitle,3);
            showAlertText("Why run when you can fight?", 2.0);

            var startingElevation = 0; // -164;
            // Stage
            //   floor
            spawnNewWidePlatform(-100, startingElevation);
            //   blocks
            spawnNewSmallPlatform(-200, startingElevation+50, 14);
            spawnNewEnemy(100, startingElevation+77, 4);
            spawnNewEnemy(200, startingElevation+77, 5);
            spawnNewEnemy(1185, startingElevation+27, 3);
            spawnNewEnemy(1300, startingElevation+27, 1);
            //   door
            spawnNewDoor(1725, startingElevation-15);
            // Actors
            //   player
            spawnNewActorPlayer(0, startingElevation+77);
            break;


        case 7:
            var levelTitle = "The Chrome Shield";
            showLevelTitle("Level "+levelID+": "+levelTitle,3);
            showAlertText("Step 1: grab powerups. Step 2: RUN!", 2.0);

            var startingElevation = 0; // -164;
            // Stage
            //   floor
            spawnNewWidePlatform(-600, startingElevation);
            //   blocks
            spawnNewEnemy(500, startingElevation+57, 4);
            spawnNewEnemy(685, startingElevation+37, 6);
            spawnNewWidePlatform(-1200, startingElevation+30, 0);
            spawnNewEnemy(980, startingElevation+7, 2);
            spawnNewEnemy(1000, startingElevation+7, 2);
            spawnNewEnemy(1020, startingElevation+7, 2);
            spawnNewEnemy(1040, startingElevation+7, 2);
            spawnNewEnemy(1060, startingElevation+7, 2);
            spawnNewEnemy(1080, startingElevation+7, 2);
            spawnNewEnemy(1100, startingElevation+7, 2);
            spawnNewEnemy(1120, startingElevation+7, 2);
            spawnNewEnemy(1140, startingElevation+7, 2);
            spawnNewEnemy(1160, startingElevation+7, 2);
            spawnNewEnemy(1180, startingElevation+7, 2);
            spawnNewEnemy(1200, startingElevation+7, 2);
            spawnNewEnemy(1220, startingElevation+7, 2);
            spawnNewEnemy(1240, startingElevation+7, 2);
            spawnNewEnemy(1260, startingElevation+7, 2);
            spawnNewEnemy(1280, startingElevation+7, 2);
            spawnNewEnemy(1300, startingElevation+7, 2);
            spawnNewEnemy(1320, startingElevation+7, 2);
            spawnNewEnemy(1340, startingElevation+7, 2);
            spawnNewEnemy(1360, startingElevation+7, 2);
            spawnNewEnemy(1380, startingElevation+7, 2);
            spawnNewEnemy(1400, startingElevation+7, 2);
            spawnNewEnemy(1420, startingElevation+7, 2);
            spawnNewEnemy(1440, startingElevation+7, 2);
            spawnNewEnemy(1460, startingElevation+7, 2);
            spawnNewEnemy(1480, startingElevation+7, 2);
            spawnNewEnemy(1500, startingElevation+7, 2);
            spawnNewEnemy(1520, startingElevation+7, 2);
            spawnNewEnemy(1540, startingElevation+7, 2);
            spawnNewEnemy(1560, startingElevation+7, 2);
            spawnNewEnemy(1580, startingElevation+7, 2);
            spawnNewEnemy(1600, startingElevation+7, 2);
            spawnNewEnemy(1620, startingElevation+7, 2);
            spawnNewEnemy(1640, startingElevation+7, 2);
            spawnNewEnemy(1660, startingElevation+7, 2);
            spawnNewWidePlatform(800, startingElevation);
            //   door
            spawnNewDoor(2225, startingElevation-15);
            // Actors
            //   player
            spawnNewActorPlayer(0, startingElevation+77);
            break;


         case 8:
             var levelTitle = "The Real World";
             showLevelTitle("Level "+levelID+": "+levelTitle,3);
             showAlertText("Your training is over...", 2.0);

             var startingElevation = -100; // -164;
            // Stage
            //   floor
            spawnNewWidePlatform(-50, startingElevation);
            //   blocks
            spawnNewSmallPlatform(50, startingElevation+70, 9);
            spawnNewEnemy(520, startingElevation+17, 0);
            spawnNewEnemy(540, startingElevation+17, 1);
            spawnNewSmallPlatform(650, startingElevation+120, 7);
            spawnNewEnemy(670, startingElevation+137, 0);
            spawnNewSmallPlatform(750, startingElevation+200, 6);
            spawnNewEnemy(1450, startingElevation+7, 2);
            spawnNewEnemy(1470, startingElevation+7, 2);
            spawnNewEnemy(1490, startingElevation+7, 2);
            spawnNewEnemy(1510, startingElevation+7, 2);
            spawnNewEnemy(1530, startingElevation+7, 2);
            spawnNewSmallPlatform(1550, startingElevation+200, 5);
            spawnNewSmallPlatform(2550, startingElevation+200, 4);
				spawnNewEnemy(2700, startingElevation+207, 0);
				spawnNewEnemy(2750, startingElevation+207, 0);
				spawnNewEnemy(2725, startingElevation+247, 0);
				spawnNewEnemy(2675, -190, 0);
				spawnNewEnemy(2100, -190, 1);
            spawnNewWidePlatform(1800, -190);
            //  door
            spawnNewDoor(1875, -190-15);
            // Actors
            //   player
            spawnNewActorPlayer(0, startingElevation+27); // TODO: re-enable
            break;



        default:
            // You win!
            data_gameWon = true;
            data_gameOver = true;
    }
}
