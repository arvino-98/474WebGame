/*
Model of the internal game state.
*/
function GameState() {
    this.player = new Player();
    this.enemyMap = new Map();
    this.casterEnemyMap = new Map()
    this.decorationMap = new Map();
    this.powerUpMap = new Map();
    this.doorOpacity = -1 // init -1
    this.unlitPillars = -1; // init -1, will be set to number of pillars spawned
    this.door = new Door("door", 150, 150, 120, 120, 0, 0, false);

    this.currentBackground = "";
    this.nextBackground = getRandomBackground();

    this.enemySpawnLoc = [590, 0]; // [xPos, yPos]
    this.enemySpawnDoorOpacity = 1;
    this.waveStep = 0;

    /*
    init()
    Clears board and spawns necessary entities.
    */
    this.init = function() {
        this.clearBoard();
        gameState.player.wave++; 
        console.log("WAVE: " + gameState.player.wave);

        //setRandomBackground();
        // set current and next backgrounds

        if(gameState.player.wave < 10){
            console.log('ENTERED IF');
            this.currentBackground = this.nextBackground;
            while (true) {
                // make sure nextBackground is different from current
                this.nextBackground = getRandomBackground();
                if (this.nextBackground != this.currentBackground) {
                    break;
                }
            }
            setBackground(this.currentBackground);
    
            // set door closed and positions
            this.door.open = false;
            this.door.xPos = getRndInteger(100, 1180);
            this.door.yPos = getRndInteger(100, 620);
    
            // spawn small decorations
            for (var i = 0; i < NUMBER_OF_DECORATIONS; i++) {
                console.log('SPAWNING DECOR')
                this.spawnRandomDecoration(DECORATION_SMALL_NAME_LIST ,15, 15, 0, 0, 50, 360, false);
            }
    
            // spawn pillars
            var pillarPositions = randomPosition();
            this.unlitPillars = pillarPositions.length;
            this.spawnDecorationShaped(DECORATION_COLLIDABLE_NAME_LIST[0], 100, 160, 40, 40, pillarPositions, 0, true);
    
            this.enemySpawnLoc = ENEMY_SPAWN_LOCATIONS[getRndInteger(0, ENEMY_SPAWN_LOCATIONS.length)];
        }
        if(gameState.player.wave == 9){
            gameState.player.speed_increment = 0;
            gameState.player.dx = 0;
            gameState.player.dy = 0;
            gameState.clearBoard();
            gameState.player.wave = 0;
            gameEnd(); 
            gameState.player.end = true; 
        }
       
        console.log('DONE!');
    }

    this.spawnPowerUp = function() {
        var p = new powerUp(
            "powerUp" + (this.powerUpMap.size + 1),
            "powerUp" + getRndInteger(1,4),
            30, 30,
            POWER_UP_HITBOX_WIDTH, POWER_UP_HITBOX_HEIGHT,
            getRndInteger(100, 900), getRndInteger(100, 700),
            0, 0
        );

        this.powerUpMap.set(p.id, p);
        $('#gameBoard').append("<div class='powerUp' id='" + p.id + "'></div>");
        console.log("powerUp ID = " + p.potion)
    }

    /*
    spawnEnemyWave()
    Spawns a wave of enemies
    numBasic = number of basic enemies you want to spawn
    numCaster = likewise for caster enemies
    */
    this.spawnEnemyWave = function(numBasic, numCaster) {
        for (var i = 0; i < numBasic; i++) {
            this.spawnBasicEnemy(this.enemySpawnLoc[0], this.enemySpawnLoc[1]);
        }
        for (var i = 0; i < numCaster; i++) {
            this.spawnCasterEnemy(this.enemySpawnLoc[0], this.enemySpawnLoc[1]);
        }
    }

    /*
    spawnBasicEnemy()
    Random ID by generating a really big integer
    Spawns an enemy entity by:
        - adding an ['id':enemy] keypair to enemyMap 
        - appending an enemy div to the #gameBoard div in the html
    */
    this.spawnBasicEnemy = function(xPos, yPos) {
        // create new enemy
        var e = new BasicEnemy(
            "basicEnemy" + getRndInteger(0, 1000000000),
            20, 20,
            BASIC_ENEMY_HITBOX_WIDTH, BASIC_ENEMY_HITBOX_HEIGHT,
            xPos, yPos,
            0, 0
        ); 
    
        this.enemyMap.set(e.id, e); // add to map
        $('#gameBoard').append("<div class='basicEnemy' id='" + e.id + "'></div>"); // add to html
    }

    /*
    spawnCasterEnemy()
    Random ID by generating a really big integer
    Spawns an enemy entity in the same fashion as spawnBasicEnemy()
    */
    this.spawnCasterEnemy = function(xPos, yPos) {
    // create new enemy
    var e = new CasterEnemy(
        "casterEnemy" + getRndInteger(0, 1000000000),
        30, 30,
        CASTER_ENEMY_HITBOX_WIDTH, CASTER_ENEMY_HITBOX_HEIGHT,
        xPos, yPos,
        0, 0
    ); 

        this.casterEnemyMap.set(e.id, e); // add to map
        $('#gameBoard').append("<div class='casterEnemy' id='" + e.id + "'></div>"); // add to html
    }

    /*
    spawnRandomDecoration()
    */
    this.spawnRandomDecoration = function(decorationNameList, width, height, hboxWidth, hboxHeight, padding, rotation_max, collidable) {
        var randName = decorationNameList[getRndInteger(0, decorationNameList.length)];
        var d = new Decoration(
            randName + "_" + (this.decorationMap.size + 1),
            randName,
            width, height,
            hboxWidth, hboxHeight,
            getRndInteger(padding, BOARD_WIDTH - padding), getRndInteger(padding, BOARD_HEIGHT - padding),
            getRndInteger(0, rotation_max),
            collidable
        );

        this.decorationMap.set(d.id, d);
        //console.log(this.decorationMap);
        $('#gameBoard').append("<div class='decoration' id='" + d.id + "'></div>"); // add to html
        if (collidable) {
            $("#" + d.id).css("z-index", 5);
        }
    }

     /*
    spawnDecoration()
    */
    this.spawnDecoration = function(decorationName, width, height, hboxWidth, hboxHeight, xPos, yPos, rotation_max, collidable) {
        var d = new Decoration(
            decorationName + "_" + (this.decorationMap.size + 1),
            decorationName,
            width, height,
            hboxWidth, hboxHeight,
            xPos, yPos,
            getRndInteger(0, rotation_max),
            collidable
        );
        this.decorationMap.set(d.id, d);
        $('#gameBoard').append("<div class='decoration' id='" + d.id + "'></div>"); // add to html
        if (collidable) { $("#" + d.id).css("z-index", 5); }
    }

    /*
    spawnDecorationShaped()
    spicfy shape to spawn decoration by array defined as: [[xPos, Ypos] , [xPos, yPos], ...]
    */
    this.spawnDecorationShaped = function(decorationName, width, height, hboxWidth, hboxHeight, postitions, rotation_max, collidable) {
        for (var i = 0; i < postitions.length; i++) {
            var d = new Decoration(
                decorationName + "_" + (this.decorationMap.size + 1),
                decorationName,
                width, height,
                hboxWidth, hboxHeight,
                postitions[i][0], postitions[i][1],
                getRndInteger(0, rotation_max),
                collidable
            );
    
            this.decorationMap.set(d.id, d);
            //console.log(this.decorationMap);
            $('#gameBoard').append("<div class='decoration' id='" + d.id + "'></div>"); // add to html
            if (collidable) {
                $("#" + d.id).css("z-index", 5);
            }
        }
    }

    /*
    spawnPillars()
    spawns 2 layers of pillars to give illusion of depth
    */
    this.spawnPillars = function(width, height, hboxWidth, hboxHeight, postitions) {
        for (var i = 0; i < postitions.length; i++) {
            var base = new Decoration(
                "tall_lantern_base" + "_" + (this.decorationMap.size + 1),
                "tall_lantern_base",
                width, height,
                hboxWidth, hboxHeight,
                postitions[i][0], postitions[i][1],
                0,
                true
            );
            var neck = new Decoration(
                "tall_lantern_neck" + "_" + (this.decorationMap.size + 1),
                "tall_lantern_neck",
                width, height,
                hboxWidth, hboxHeight,
                postitions[i][0], postitions[i][1],
                0,
                false
            );

            this.decorationMap.set(base.id, base);
            this.decorationMap.set(neck.id, neck);

            $('#gameBoard').append("<div class='decoration' id='" + base.id + "'></div>"); // add to html
            $("#" + base.id).css("z-index", 2); // base indexed to background

            $('#gameBoard').append("<div class='decoration' id='" + neck.id + "'></div>"); // add to html
            $("#" + neck.id).css("z-index", 5); // neck indexed to foreground
        }
    }

    /*
    removeByID()
    Remove an enemy entity by ID
    */
    this.removeByID = function(id) {
        if(id == "basicEnemy"){
            $('#' + id).remove(); // remove from html
            this.enemyMap.delete(id); // remove from map
        } else {
        $('#' + id).remove(); // remove from html
        this.powerUpMap.delete(id); // remove from map
        }
    }

    /*
    clearBoard()
    Remove all entities present in the internal game state and html
    */
    this.clearBoard = function() {
        this.enemyMap.clear();
        this.casterEnemyMap.clear();
        this.decorationMap.clear();
        this.powerUpMap.clear();
        $('.basicEnemy').remove();
        $('.casterEnemy').remove();
        $('.casterProjectile').remove();
        $('.decoration').remove();
        $('.powerUp').remove();
    }

}


/*
gameLoop()
Main game loop that continuously updates entitities
and checks/handles collisions
*/
function gameLoop() {
    // console.log('LOOP RUNNING')
if(gameState.player.end == false){ 
    // console.log('LOOP IF!');
       // player lights all pillars, open door to next level
    if (gameState.unlitPillars == 0 && gameState.enemyMap.size <= 0 && gameState.casterEnemyMap.size <= 0) {
        gameState.door.open = true;
    }

  

    // spawn wave of enemies if there are still unlit pillars
    /*
    if (gameState.unlitPillars != 0 && (gameState.enemyMap.size+gameState.casterEnemyMap.size) <= 1 ) {
        var a = getRndInteger(0, 100);
        if (a <= 5){ gameState.spawnEnemyWave(getRndInteger(3, 5), getRndInteger(0, 2)); }
    }
    */

    if (gameState.unlitPillars != 0 && (gameState.enemyMap.size+gameState.casterEnemyMap.size) <= 20 && gameState.waveStep % 100 == 0) {
        //gameState.spawnEnemyWave(getRndInteger(3, 6), getRndInteger(0, 2));
        var a = getRndInteger(0, 100);
        gameState.spawnBasicEnemy(gameState.enemySpawnLoc[0], gameState.enemySpawnLoc[1]);
        gameState.spawnBasicEnemy(gameState.enemySpawnLoc[0], gameState.enemySpawnLoc[1]);

        if (a <= 5) {
            gameState.spawnCasterEnemy(gameState.enemySpawnLoc[0], gameState.enemySpawnLoc[1]);
        }
        console.log('PU MAP SIZE: ' + gameState.powerUpMap.size);
        if( gameState.powerUpMap.size < 4 && !(gameState.player.health <= 0) && !(gameState.door.open)){
            gameState.spawnPowerUp(640, 50);
            console.log('NEW POWER-UP');
        }
    }
    gameState.waveStep += 1;

    // adjust door opacity according to unlit pillars
    gameState.doorOpacity = 1 / (gameState.unlitPillars + 1);
    gameState.enemySpawnDoorOpacity = 1 - gameState.doorOpacity;


    // update player
    gameState.player.update();

    // check player death
    if (gameState.player.health <= 0) {
        //console.log("Player died");
        gameState.player.speed_increment = 0;
        gameState.player.dx = 0;
        gameState.player.dy = 0;
        gameState.player.wave = 0; 
        setTimeout(function() { 
            gameState.clearBoard();
            gameEnd(); 
        }, GAME_END_TIMEOUT);
    }

    // update all enemies in enemyMap
    gameState.enemyMap.forEach(function(value, key, map) {
        value.playerXPos = gameState.player.xPos;
        value.playerYPos = gameState.player.yPos;
        value.update();
    }); 

    // update all enemies in casterEnemyMap
    gameState.casterEnemyMap.forEach(function(value, key, map) {
        value.playerXPos = gameState.player.xPos;
        value.playerYPos = gameState.player.yPos;
        value.playerDx = gameState.player.dx;
        value.playerDy = gameState.player.dy;
        value.update();
    });

    gameState.powerUpMap.forEach(
        function(value, key, map){
            if(isCollide(gameState.player, value)){
               if(value.potion == "powerUp1"){ 
                  if(gameState.player.health > 79){
                        gameState.player.health += (100 - gameState.player.health)
                    } else {
                        gameState.player.health += 20;
                    }
                    console.log(gameState.player.health)
                }
                if(value.potion == "powerUp2"){
                    gameState.player.powerUp2 = true;
                }
                if(value.potion == "powerUp3"){
                    console.log('INVINCIBLE')
                    gameState.player.invincible = true;
                    setTimeout(function(){ console.log('TIMES UP!'); gameState.player.invincible = false;}, 10000); 
                }
                gameState.removeByID(key);
                
                //console.log("value " + value)
                //console.log("key: " + key)
                console.log(value.potion)
            }
    });

    // handle and check for collisions
    checkPlayerBasicEnemyCollision(); // player and all enemies
    checkPlayerDecorationCollision(); // player and decorations
    checkPlayerCasterEnemyCollision(); // player and caster enemies
    checkEnemyDecorationCollision(); // enemies and decorations
    checkPlayerDoorCollision(); // player and door

    requestAnimationFrame(gameLoop); // loop
}
}

/*
Collision code below...
*/

/*
playerBloodSplashEffect()
Creates a blood splash effect behind player sprite
*/
function playerBloodSplashEffect() {
    $('#bloodSplash').css("top", gameState.player.yPos + "px");
    $('#bloodSplash').css("left", gameState.player.xPos-10 + "px");
    $('#bloodSplash').css('transform', "rotate(" + getRndInteger(0, 360) + "deg)");
    $('#bloodSplash').css("visibility", "visible");
    setTimeout(function(){ $('#bloodSplash').css("visibility", "hidden") }, 300);
}

/*
checkPlayerBasicEnemyCollision()
checks and handles collisions between the player and all enemies in enemy map
*/
function checkPlayerBasicEnemyCollision() {
    gameState.enemyMap.forEach(function(value, key, map) {
        if (isCollide(gameState.player, value)) {
            //console.log("collision detected: " + key)
            // if attacking
            if (gameState.player.attacking && gameState.player.health > 0) {
                value.alive = false;
                /*
                // set hidden for a split second gives appearance of being sucked in and blown away
                $('#' + key).css("visibility", "hidden");
                setTimeout(function(){$('#' + key).css("visibility", "visible");}, 100);
                // send enemy flying in random direction
                value.dx = getRndInteger(-5, 5); 
                value.dy = BASIC_ENEMY_THROWN_SPEED;
                // remove from game after n msec
                setTimeout(function(){gameState.removeByID(key)}, BASIC_ENEMY_REMOVE_TIMEOUT);
                */
                $('#' + key).remove();
                gameState.enemyMap.delete(key); // remove from map
            }

            // if not attacking
            else if (!gameState.player.attacking && gameState.player.health > 0 && gameState.player.invincible == false){
                // delta magnified to simulate pushback
                gameState.player.dx = value.dx * 20;
                gameState.player.dy = value.dy * 20;
                // disable plaer movement for a set time
                gameState.player.stuck = true;
                setTimeout(function() { gameState.player.stuck = false; }, 250);
                // take damage
                gameState.player.health -= value.damage;
                // show blood splatter effect
                playerBloodSplashEffect();
            }
        }
    });
}

/*
checkPlayerDecorationCollision()
checks and handles collisions between the player and all decorations in decoration map
*/
function checkPlayerDecorationCollision() {
    gameState.decorationMap.forEach(
        function(value, key, map) {
            if (isCollideDecoration(gameState.player, value, value.xPos+25, value.yPos+100) && value.collidable) {
                    gameState.player.dx *= -10;
                    gameState.player.dy *= -10;
                    // disable player movement for a set time
                    gameState.player.stuck = true;
                    setTimeout(function() { gameState.player.stuck = false; }, 200);
                    // set pillar collided
                    if (!value.collided) { 
                        gameState.unlitPillars -= 1; 
                        value.collided = true;
                        //value.name = 'tall_lantern_lit_neck';

                        // set fire effect to indicate on
                        var fire = new Decoration(
                            "tall_lantern_lit_neck" + "_" + (gameState.decorationMap.size + 1),
                            "tall_lantern_lit_neck",
                            value.width, value.height,
                            0, 0,
                            value.xPos, value.yPos,
                            0,
                            false
                        );
                        gameState.decorationMap.set(fire.id, fire);
                        $('#gameBoard').append("<div class='decoration' id='" + fire.id + "'></div>"); // add to html
                        $("#" + fire.id).css("z-index", 5);
                    }
            }
    });
}

/*
checkPlayerCasterEnemyCollision()
checks and handles collisions between the player and all enemies in enemy map
*/
function checkPlayerCasterEnemyCollision() {
    // handle collision between player and caster enemies
    gameState.casterEnemyMap.forEach(function(value, key, map) {
        // handle collision between player and caster projectiles
        value.projectileMap.forEach(function(proj_value, proj_key, proj_map) {
            if (isCollide(gameState.player, proj_value) && gameState.player.health > 0) {
                if (gameState.player.attacking) {
                    // set hidden for a split second gives appearance of being sucked in and blown away
                    $('#' + key).css("visibility", "hidden");
                    setTimeout(function(){$('#' + key).css("visibility", "visible");}, 100);
                    // send enemy flying in random direction
                    proj_value.dx = getRndInteger(-5, 5); 
                    proj_value.dy = CASTER_ENEMY_THROWN_SPEED;
                } 
                else if (!gameState.player.attacking) {
                    // take damage
                    gameState.player.health -= proj_value.damage;
                    // show blood splatter effect
                    playerBloodSplashEffect();
                }   
            }

            // check collision between projectiles and decorations
            gameState.decorationMap.forEach(
                function(d_value, d_key, d_map) {
                    if (isCollideDecoration(proj_value, d_value, d_value.xPos+5, d_value.yPos+100) && d_value.collidable) {
                            /*
                            var randId = getRndInteger(0, 10000000);
                            $('#gameBoard').append("<div class='magicExplosion'id='magicExplosion" + randId + "'></div>");
                            $('#magicExplosion' + randId).css('left', (proj_value.xPos+(proj_value.dx*2)) + "px");
                            $('#magicExplosion' + randId).css('top', (proj_value.yPos+(proj_value.dy*2)) + "px");
                            setTimeout( function() { $('#magicExplosion' + randId).remove(); }, 1000);
                            */
                            $('#' + proj_value.id).fadeOut("slow");
                            proj_map.delete(proj_value.id); // remove from map
                            setTimeout( function() { $('#' + proj_value.id).remove(); }, 1000);
                    }
            });
        });

        // handle collision between player and caster enemy
        if (isCollide(gameState.player, value)) {
            // if attacking
            if (gameState.player.attacking && gameState.player.health > 0) {
                // remove enemy's projectiles
                value.projectileMap.forEach(function(proj_value, proj_key, proj_map) {
                    $('#' + proj_key).remove();
                });
                value.projectileMap.clear();
                // remove enemy
                $('#' + key).remove();
                gameState.casterEnemyMap.delete(key); // remove from map
            }
            // if not attacking
            else if (!gameState.player.attacking && gameState.player.health > 0){
                // delta magnified to simulate pushback
                gameState.player.dx = value.dx * 20;
                gameState.player.dy = value.dy * 20;

                // disable plaer movement for a set time
                gameState.player.stuck = true;
                setTimeout(function() { gameState.player.stuck = false; }, 250);
                // take damage
                gameState.player.health -= value.damage;
                // show blood splatter effect
                playerBloodSplashEffect();
            }
        }
    });
}

/*
checkEnemyDecorationCollision()
checks and handles collisions between the player and all enemies in enemy map
*/
function checkEnemyDecorationCollision() {
    gameState.enemyMap.forEach(function(a_value, a_key) {
        gameState.decorationMap.forEach(function(b_value, b_key) {
            if (isCollideDecoration(a_value, b_value, b_value.xPos, b_value.yPos+100) && b_value.collidable) {
                a_value.dx *= -1.09;
                a_value.dy *= -1.09;
            }
        });
    }); 
}

/*
checkPlayerDoorCollision() 
*/
function checkPlayerDoorCollision() {
    if (isCollide(gameState.player, gameState.door) && gameState.door.open) {
        gameState.init(); // move to next stage
        //console.log("door collision")
    }
}