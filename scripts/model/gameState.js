/*
Model of the internal game state.
*/
BOARD_WIDTH = $('#gameBoard').width();
BOARD_HEIGHT = $('#gameBoard').height();

function GameState() {
    this.player = new Player();
    this.environment = new Environment()
    this.enemyMap = new Map();

    this.init = function() {
        this.player.init();
        requestAnimationFrame(gameLoop); // loop
    }

    /*
    Spawns an enemy entity by:
        - adding an ['id':enemy] keypair to enemyMap 
        - appending an enemy div to the #gameBoard div in the html
    */
    this.spawnBasicEnemy = function() {
        // create new enemy
        var e = new BasicEnemy(
            "basicEnemy" + (gameState.enemyMap.size + 1),
            30, 30,
            64, 64,
            getRndInteger(100, 500), getRndInteger(100, 500),
            getRndInteger(-5, 5), getRndInteger(-5, 5),
            0, 0); 
    
        gameState.enemyMap.set(e.id, e); // add to map
        $('#gameBoard').append("<div class='basicEnemy' id='" + e.id + "'></div>"); // add to html
    }

    /*
    Remove an enemy entity by ID
    */
    this.removeByID = function(id) {
        $('#' + id).remove(); // remove from html
        this.enemyMap.delete(id); // remove from map
    }
}

/*
Main game loop that continuously updates entitities
and checks/handles collisions
*/
function gameLoop() {
    gameState.player.update(); // update player

    // update all enemies in enemyMap
    gameState.enemyMap.forEach(function(value, key, map) {
        value.playerXPos = gameState.player.xPos;
        value.playerYPos = gameState.player.yPos;
        value.updatePosition()
    }); 

    // check for collisions between player and all enemies.
    gameState.enemyMap.forEach(
        function(value, key, map) {
            if (isCollide(gameState.player, value)) {
                //console.log("collision detected: " + key)

                if (gameState.player.attacking) {
                    value.alive = false;

                    // set hidden for a split second gives appearance of being sucked in and blown away
                    $('#' + key).css("visibility", "hidden");
                    setTimeout(function(){$('#' + key).css("visibility", "visible");}, 150);

                    // send enemy flying in random direction
                    value.dx = (getRndInteger(-15, 15)); 
                    value.dy = 10;

                    // remove from game after n msec
                    setTimeout(function(){gameState.removeByID(key)}, 1500);
                }

                else {
                    // player takes damage?
                    gameState.player.dx = value.dx * 20;
                    gameState.player.dy = value.dy * 20;

                    // disable plaer movement for a set time
                    gameState.player.stuck = true;
                    setTimeout(function() { gameState.player.stuck = false; }, 250);

                    gameState.player.health -= .5;
                }

            }
    });

    requestAnimationFrame(gameLoop); // loop
}


