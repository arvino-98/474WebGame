function gameStart(){
    $('#startScreen').css("visibility", "hidden");
    $('#gameBoard').css("visibility", "visible");
    gameState.init();
}

function gameEnd(){
    $('#startScreen').css("visibility", "hidden");
    $('#gameBoard').css("visibility", "hidden");
    $('#deathScreen').css("visibility", "visible");
}

function gameRestart(){
    var loc = $(location).attr('href');
    window.location.replace(loc);
}