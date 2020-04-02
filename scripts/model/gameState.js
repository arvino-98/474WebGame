/*
Model of the internal game state.
*/
function GameState() {
    this.player = new Player();
    this.enemyMap = new Map();
    this.powerUpMap = new Map();
    this.decorationMap = new Map();

    /*
    init()
    */
    this.init = function() {
        // spawn small decorations
        for (var i = 0; i < NUMBER_OF_DECORATIONS; i++) {
            this.spawnRandomDecoration(DECORATION_SMALL_NAME_LIST ,15, 15, 0, 0, 50, 360, false);
        }

        this.spawnDecorationShaped(DECORATION_COLLIDABLE_NAME_LIST[0], 100, 160, 40, 40, randomPosition(), 0, true);

        requestAnimationFrame(gameLoop); // loop
    }

    /*
    spawnBasicEnemy()
    Spawns an enemy entity by:
        - adding an ['id':enemy] keypair to enemyMap 
        - appending an enemy div to the #gameBoard div in the html
    */
    this.spawnBasicEnemy = function(xPos, yPos) {
        // create new enemy
        var e = new BasicEnemy(
            "basicEnemy" + (this.enemyMap.size + 1),
            30, 30,
            BASIC_ENEMY_HITBOX_WIDTH, BASIC_ENEMY_HITBOX_HEIGHT,
            xPos, yPos,
            0, 0
        ); 
    
        this.enemyMap.set(e.id, e); // add to map
        $('#gameBoard').append("<div class='basicEnemy' id='" + e.id + "'></div>"); // add to html
    }

    this.spawnPowerUp = function() {
        var p = new powerUp(
            "powerUp" + (this.powerUpMap.size + 1),
            30, 30,
            POWER_UP_HITBOX_WIDTH, POWER_UP_HITBOX_HEIGHT,
            //xPos, yPos,
            //getRndInteger($('#gameBoard').width()+100, $('#gameBoard').width()-100,
            //getRndInteger($('#gameBoard').height()+100, $('#gameBoard').height()-100),
            getRndInteger(100, 900), getRndInteger(100, 700),
            0, 0
        );

        this.powerUpMap.set(p.id, p);
        $('#gameBoard').append("<div class='powerUp' id='" + p.id + "'></div>");
        //console.log("spawnPowerUp function ran");
        //console.log(this.powerUpMap.size);
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
        //console.log(this.decorationMap);
        $('#gameBoard').append("<div class='decoration' id='" + d.id + "'></div>"); // add to html
        if (collidable) {
            $("#" + d.id).css("z-index", 5);
        }
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

}


/*
Main game loop that continuously updates entitities
and checks/handles collisions
*/
function gameLoop() {
    // update player
    gameState.player.update();

    // check player death
    if (gameState.player.health <= 0) {
        //console.log("Player died");
        gameState.player.speed_increment = 0;
        gameState.player.dx = 0;
        gameState.player.dy = 0;
        setTimeout(function() { gameEnd(); }, GAME_END_TIMEOUT);
    }

    // update all enemies in enemyMap
    gameState.enemyMap.forEach(function(value, key, map) {
        value.playerXPos = gameState.player.xPos;
        value.playerYPos = gameState.player.yPos;
        value.update();
    }); 

    gameState.powerUpMap.forEach(
        function(value, key, map){
            if(isCollide(gameState.player, value)){
                gameState.removeByID(key);
                if(gameState.player.health > 79){
                    gameState.player.health += (100 - gameState.player.health)
                } else {
                    gameState.player.health += 20;
                }
                
                console.log("collision detected: " + key)
                console.log(gameState.player.health)
            }
    });

    // check for collisions between player and all enemies.
    gameState.enemyMap.forEach(
        function(value, key, map) {
            if (isCollide(gameState.player, value)) {
                //console.log("collision detected: " + key)

                // if attacking
                if (gameState.player.attacking && gameState.player.health > 0) {
                    value.alive = false;

                    // set hidden for a split second gives appearance of being sucked in and blown away
                    $('#' + key).css("visibility", "hidden");
                    setTimeout(function(){$('#' + key).css("visibility", "visible");}, 100);

                    // send enemy flying in random direction
                    value.dx = getRndInteger(-5, 5); 
                    value.dy = BASIC_ENEMY_THROWN_SPEED;

                    // remove from game after n msec
                    setTimeout(function(){gameState.removeByID(key)}, BASIC_ENEMY_REMOVE_TIMEOUT);
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
                    $('#bloodSplash').css("top", gameState.player.yPos + "px");
                    $('#bloodSplash').css("left", gameState.player.xPos-10 + "px");
                    $('#bloodSplash').css('transform', "rotate(" + getRndInteger(0, 360) + "deg)");
                    $('#bloodSplash').css("visibility", "visible");
                    setTimeout(function(){ $('#bloodSplash').css("visibility", "hidden") }, 300);
                }

            }
    });

    // handle collision between player and decorations
    gameState.decorationMap.forEach(
        function(value, key, map) {
            if (isCollideDecoration(gameState.player, value, value.xPos+5, value.yPos+100) && value.collidable) {
                    gameState.player.dx *= -10;
                    gameState.player.dy *= -10;

                    // disable player movement for a set time
                    gameState.player.stuck = true;
                    setTimeout(function() { gameState.player.stuck = false; }, 200);
            }
    });

    // handle collision between enemy and decoration
    gameState.enemyMap.forEach(function(a_value, a_key) {
        gameState.decorationMap.forEach(function(b_value, b_key) {
            if (isCollideDecoration(a_value, b_value, b_value.xPos, b_value.yPos+100) && b_value.collidable) {
                a_value.dx *= -1.15;
                a_value.dy *= -1.15;
            }
        });
    });
    

    // handle collision between enemies
    /*
    gameState.enemyMap.forEach(function(value, key, map) {
        // kinda shit...
        var a_value = value;
        var a_key = key;
        gameState.enemyMap.forEach(function(value, key, map) {
            b_value = value;
            b_key = key;
            if (a_key != b_key) {
                if (isCollide(a_value, b_value)) {
                    console.log("enemy collide");
                    b_value.dx *= BASIC_ENEMY_BOUNCE_FACTOR;
                    b_value.dy *= BASIC_ENEMY_BOUNCE_FACTOR;
                }  
            }
        });
    });
    */
        
    requestAnimationFrame(gameLoop); // loop
}