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
            20, 20,
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
    gameState.enemyMap.forEach(function(value, key, map) {value.updatePosition()}); // update all enemies in enemyMap

    // check for collisions between player and all enemies.
    gameState.enemyMap.forEach(
        function(value, key, map) {
            if (isCollide(gameState.player, value)) {
                //console.log("collision detected: " + key)
                if (gameState.player.attacking) {
                    value.alive = false;

                    $('#' + key).css("visibility", "hidden");
                    setTimeout(function(){$('#' + key).css("visibility", "visible");}, 200);

                    // send enemy flying in random direction
                    value.dx = 5 * (getRndInteger(-2, 1) + 1); 
                    value.dy = 5 * (getRndInteger(-2, 1) + 1);

                    // remove from game after n msec
                    setTimeout(function(){gameState.removeByID(key)}, 2000);
                }
                else {
                    // player takes damage?
                }
            }
    });

    requestAnimationFrame(gameLoop); // loop
}


