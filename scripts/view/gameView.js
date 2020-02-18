/*
View of the game.
Handles the updating of html and css according
to internal game state.
*/
let playerSpritePos = PLAYER_WIDTH / 5; // position of player sprite set
const playerSpriteIncr = 36.8; // 37 41 36.8

function updateCSSLoop() {
    updatePlayerCSS();
    gameState.enemyMap.forEach(updateBasicEnemyCSS);

    requestAnimationFrame(updateCSSLoop); // loop
}

function updatePlayerCSS(){
    // update player stamina text
    $("#playerStamina").css("width", Math.floor(gameState.player.stamina) + "%");
    $("#playerHealth").css("width", Math.floor(gameState.player.health) + "%");

    // not attacking sprites
    if (!(gameState.player.attacking)) {
        $("#player").css("filter", "")
        // choose image set based on direction
        if (gameState.player.angle == NORTH) {
            $("#player").css("background-image", "url('../images/dark_soldier_north_shadow.png')");
        }
        else if (gameState.player.angle == EAST){
            $("#player").css("background-image","url('../images/dark_soldier_east_shadow.png')");
        }
        else if (gameState.player.angle == WEST){
            $("#player").css("background-image","url('../images/dark_soldier_west_shadow.png')");
        }
        else if (gameState.player.angle == SOUTH){
            $("#player").css("background-image","url('../images/dark_soldier_south_shadow.png')");
        }

        // code to animate sprites upon movement
        document.getElementById("player").style.backgroundPosition = `-${playerSpritePos}px 0px`;
        if (gameState.player.moving) {
            if (gameState.player.step % 8 == 0) {
                playerSpritePos += playerSpriteIncr;
            }
        }
        else {
            playerSpritePos = 0;
        }
    }
    // attacking sprites
    else if (gameState.player.attacking) {
        document.getElementById("player").style.backgroundPosition = `-8px 0px`;
        $("#player").css("filter", "drop-shadow(5px 13px 3px rgba(34, 34, 34, 0.70))")
        $("#player").css("background-image","url('../images/tornado_small.gif')");
    }

    $('#player').css('left', gameState.player.xPos + 'px');
    $('#player').css('top', gameState.player.yPos + 'px');
}

function updateBasicEnemyCSS(value, key, map) {
    if (value.alive) {
        // choose image set based on direction
        if (value.angle == NORTH) {
            $("#" + key).css("background-image", "url('../images/spider_north.png')");
        }
        else if (value.angle == EAST){
            $("#" + key).css("background-image","url('../images/spider_east.png')");
        }
        else if (value.angle == WEST){
            $("#" + key).css("background-image","url('../images/spider_west.png')");
        }
        else if (value.angle == SOUTH){
            $("#" + key).css("background-image","url('../images/spider_south.png')");
        }

        // code to animate sprites upon movement
        document.getElementById(key).style.backgroundPosition = `-${value.spritePos}px 0px`;
        if (value.moving) {
            if (value.step % 6 == 0) {
                value.spritePos += 64;
            }
        }
        else {
            value.spritePos = 0;
        }
    }
    else {
        $("#" + key).css("filter", "drop-shadow(5px 20px 0px rgba(34, 34, 34, 1))");
    }

    //console.log("update: " + value);
    $('#' + value.id).css('left', value.xPos + 'px');
    $('#' + value.id).css('top', value.yPos + 'px');

}
