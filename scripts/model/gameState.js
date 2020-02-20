/*
Model of the internal game state.
*/
function GameState() {
    this.player = new Player();
    this.enemyMap = new Map();
    this.decorationMap = new Map();

    this.init = function() {
        for (var i = 0; i < NUMBER_OF_DECORATIONS; i++) {
            this.spawnRandomDecoration();
        }

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

    /*
    removeByID()
    Remove an enemy entity by ID
    */
    this.removeByID = function(id) {
        $('#' + id).remove(); // remove from html
        this.enemyMap.delete(id); // remove from map
    }

    /*
    spawnRandomDecoration()
    */
    this.spawnRandomDecoration = function() {
        var randName = DECORATION_NAME_LIST[getRndInteger(0, DECORATION_NAME_LIST.length)];
        var d = new Decoration(
            randName + "_" + (this.decorationMap.size + 1),
            randName,
            0, 0,
            0, 0,
            getRndInteger(50, BOARD_WIDTH - 50), getRndInteger(50, BOARD_HEIGHT - 50),
            getRndInteger(0, 360),
            false
        );

        this.decorationMap.set(d.id, d);
        //console.log(this.decorationMap);
        $('#gameBoard').append("<div class='decoration' id='" + d.id + "'></div>"); // add to html
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

                    gameState.player.health -= value.damage;
                }

                //if player dead. slow and stop the enemy that killed him
                else if (gameState.player.health <= 0) {
                    //console.log("enemy collide dead player")
                    value.speed_increment = 0;
                    value.dx *= .90;
                    value.dy *= .90;
                }

            }
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


