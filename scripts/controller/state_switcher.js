function gameStart(){
    $('#startScreen').css("visibility", "hidden");
    $('#gameBoard').css("visibility", "visible");
    $('.toolbarButton').css("visibility", "visible");
    gameState.init();
    requestAnimationFrame(gameLoop); // loop
}

function gameEnd(){
    if(gameState.player.end == true){
        $('#startScreen').css("visibility", "hidden");
        $('#gameBoard').css("visibility", "hidden");
        $('.toolbarButton').css("visibility", "hidden");
        $('#winScreen').css("visibility", "visible");
    }
    else{
        $('#startScreen').css("visibility", "hidden");
        $('#gameBoard').css("visibility", "hidden");
        $('.toolbarButton').css("visibility", "hidden");
        $('#deathScreen').css("visibility", "visible");
    }
}

function gameRestart(){
    var loc = $(location).attr('href');
    window.location.replace(loc);
}