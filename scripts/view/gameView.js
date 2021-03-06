/*
View of the game.
Handles the updating of html and css according
to internal game state.
*/
let playerSpritePos = PLAYER_WIDTH / 5; // position of player sprite set
const playerSpriteIncr = 36.8; // 37 41 36.8

function updateCSSLoop() {
    updatePlayerCSS();

    gameState.enemyMap.forEach(updateBasicEnemyCSS); // update basic enemy
    gameState.decorationMap.forEach(loadDecorations); // update decorations
    gameState.powerUpMap.forEach(loadPowerUps);

    // update caster enemy and projectiles
    gameState.casterEnemyMap.forEach(function(value, key, map) {
        updateCasterEnemyCSS(value, key, map);
        value.projectileMap.forEach(updateCasterProjectileCSS);
    });

    updateDoorCSS();
    updateEnemySpawnDoorCSS();

    requestAnimationFrame(updateCSSLoop); // loop
}

function updatePlayerCSS(){
    // update player stamina text
    $("#playerStamina").css("width", Math.floor(gameState.player.stamina) + "%");
    $("#playerHealth").css("width", Math.floor(gameState.player.health) + "%");

    // not attacking sprites
    if (!gameState.player.attacking && gameState.player.health > 0) {
        $("#player").css("filter", "")
        // choose image set based on direction
        if (gameState.player.dy < 0) {
            $("#player").css("background-image", "url('../images/dark_soldier_north_shadow.png')");
        }
        else if (gameState.player.dx > 0){
            $("#player").css("background-image","url('../images/dark_soldier_east_shadow.png')");
        }
        else if (gameState.player.dx < 0){
            $("#player").css("background-image","url('../images/dark_soldier_west_shadow.png')");
        }
        else if (gameState.player.dy >= 0){
            $("#player").css("background-image","url('../images/dark_soldier_south_shadow.png')");
        }

        // code to animate sprites upon movement
        document.getElementById("player").style.backgroundPosition = `-${playerSpritePos}px 0px`;
        if (gameState.player.moving) {
            if (gameState.player.step % 6 == 0) {
                playerSpritePos += playerSpriteIncr;
            }
        }
        else {
            playerSpritePos = 0;
        }
    }
    // attacking sprites
    else if (gameState.player.attacking && gameState.player.health > 0) {
        document.getElementById("player").style.backgroundPosition = `-8px 0px`;
        $("#player").css("filter", "drop-shadow(5px 13px 3px rgba(34, 34, 34, 0.70))")
        $("#player").css("background-image","url('../images/tornado_small.gif')");
    }

    // dead player
    else if (gameState.player.health <= 0) {
        // change sprite to dead player
        document.getElementById("player").style.backgroundPosition = `-4px 0px`;
        $("#player").css("background-image","url('../images/dark_soldier_dead_shadow.png')");
        $("#player").css("filter", "drop-shadow(5px 5px 3px rgba(34, 34, 34, 0.9))")
        $("#player").css("height", "60")
        $("#player").css("width", "55")

        // code for blood pool effect
        $('#gameBoard').append("<div id='bloodPool'></div>");
        $('#bloodPool').css("background-image","url('../images/blood_pool.gif')");
        $("#bloodPool").css("position", "absolute");
        $("#bloodPool").css("height", "120")
        $("#bloodPool").css("width", "120");
        $("#bloodPool").css("opacity", ".60");
        $('#bloodPool').css('left', gameState.player.xPos-20 + 'px');
        $('#bloodPool').css('top', gameState.player.yPos-20 + 'px');
    }

    // update position
    $('#player').css('left', gameState.player.xPos + 'px');
    $('#player').css('top', gameState.player.yPos + 'px');
}

/*
Update enemy css
*/
function updateBasicEnemyCSS(value, key, map) {
    if (value.alive) {
        // choose image set based on direction
        if (value.dy < 0) {
            $("#" + key).css("background-image", "url('../images/spider_north.png')");
        } else if (value.dx > 0){
            $("#" + key).css("background-image","url('../images/spider_east.png')");
        } else if (value.dx < 0){
            $("#" + key).css("background-image","url('../images/spider_west.png')");
        } else if (value.dy >= 0){
            $("#" + key).css("background-image","url('../images/spider_south.png')");
        }

        // code to animate sprites upon movement
        document.getElementById(key).style.backgroundPosition = `-${value.spritePos}px 0px`;
        if (value.moving) {
            if (value.step % 6 == 0) {
                value.spritePos += 64;
            }
            // dust cloud effect - suck, make game slow, no good
            /*
            if (value.step % 16 == 0) {
                var randID = getRndInteger(0, 1000000);
                $('#gameBoard').append("<div class='dustCloud' id='dustCloud" + randID + "'></div>"); // add to html
                $('#dustCloud' + randID).css("left", (value.xPos-(value.dx*10)) + 'px');
                $('#dustCloud' + randID).css("top", (value.yPos-(value.dy*5)) + 'px');
                setTimeout( function() {$('#dustCloud' + randID).remove();}, 200);
                //console.log('#dustCloud' + randID);
            }
            */
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

function loadDecorations(value, key, map) {
    $("#" + value.id).css("background-image", "url('../images/decoration/" + value.name + ".png')");
    $('#' + value.id).css('height', value.height + 'px');
    $('#' + value.id).css('width', value.width + 'px');
    $('#' + value.id).css('left', value.xPos + 'px');
    $('#' + value.id).css('top', value.yPos + 'px');
    $('#' + value.id).css('transform', "rotate(" + value.rotation + "deg)");
    //console.log("load " + value.map_id)
}

function loadPowerUps(value, key, map) {
   
        $("#" + value.id).css("powerUp", "url('../images/potion.png')");
        $('#' + value.id).css('left', value.xPos + 'px');
        $('#' + value.id).css('top', value.yPos + 'px');
   
    //console.log("load " + value.id);
}

function updateCasterEnemyCSS(value, key, map) {
    if (value.alive) {
        // choose image set based on direction
        if (value.dy < 0) {
            $("#" + key).css("background-image", "url('../temp_images/mage_north.png')");
        }
        else if (value.dx > 0){
            $("#" + key).css("background-image","url('../temp_images/mage_east.png')");
        }
        else if (value.dx < 0){
            $("#" + key).css("background-image","url('../temp_images/mage_west.png')");
        }
        else if (value.dy >= 0){
            $("#" + key).css("background-image","url('../temp_images/mage_south.png')");
        }

        // code to animate sprites upon movement
        document.getElementById(key).style.backgroundPosition = `-${value.spritePos}px 0px`;
        if (value.moving) {
            if (value.step % 12 == 0) {
                value.spritePos += 48.83; // width of caster sprite sheet / number of frames(6)
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

function updateCasterProjectileCSS(value, key, map) {
    $('#' + value.id).css('transform',"rotate(90deg)")
    $('#' + value.id).css('left', value.xPos + 'px');
    $('#' + value.id).css('top', value.yPos + 'px');
}

function updateDoorCSS() {
    $('#door').css('background', "url('../images/backgrounds/" + gameState.nextBackground + ".png')");
    $('#door').css('opacity', gameState.doorOpacity);

    // visible if open, else hidden
    if (gameState.door.open) {
        //$('#door').css('visibility', 'visible');
        $('#door').css('box-shadow', "0 0 6px 3px #fff, 0 0 10px 6px rgba(89, 31, 197, 0.90), 0 0 14px 9px rgba(89, 31, 197, 0.50)");
        $('#door').css("filter", "");
    } else {
        //$('#door').css('visibility', 'hidden');
        $('#door').css('box-shadow', "");
        $('#door').css('filter', "blur(1px)");
    }
    
    $('#door').css('left', gameState.door.xPos + 'px');
    $('#door').css('top', gameState.door.yPos + 'px');

    $('#door').css('background-position', (-gameState.door.xPos) + 'px ' +  (-gameState.door.yPos+30) + 'px');
}

function updateEnemySpawnDoorCSS() {
    $('#enemySpawnDoor').css('left', gameState.enemySpawnLoc[0] + 'px');
    $('#enemySpawnDoor').css('top', gameState.enemySpawnLoc[1] + 'px');
    $('#enemySpawnDoor').css('opacity', gameState.enemySpawnDoorOpacity);
}
