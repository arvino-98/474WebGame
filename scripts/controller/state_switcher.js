function gameStart(){
    $('#startScreen').css("visibility", "hidden");
    $('#gameBoard').css("visibility", "visible");
    gameState.init();
}

function gameEnd(){
}

function gameRestart(){
    var loc = $(location).attr('href')
    window.location.replace(loc);
}