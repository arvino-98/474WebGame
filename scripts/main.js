/*
Main
Create the game's:
    internal state (gameState) 
    key/input listeners (input)

Initialize the loop that will update the CSS based on internal game state (view).
*/

var gameState = new GameState();
var input = new Input();

updateCSSLoop(gameState);