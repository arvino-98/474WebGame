/*
General utility functions/constants below...
*/
const NORTH = 2;
const EAST = -1;
const SOUTH = -2;
const WEST = 1;

// print to console...
function logEnemyMapSize() {
    console.log(gameState.enemyMap.size);
}

// random integer within range [min,max]
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

/*
Determine collision between objects a and b.
a and b must have xPos, yPos, hitboxWidth, and hitboxHeight properties.
*/
function isCollide(a, b) {
    return !(
        ((a.yPos + a.hitboxHeight) < (b.yPos)) ||
        (a.yPos > (b.yPos + b.hitboxHeight)) ||
        ((a.xPos + a.hitboxWidth) < b.xPos) ||
        (a.xPos > (b.xPos + b.hitboxWidth))
    );
}

// for testing...
function buttonSpawn() {
    gameState.spawnBasicEnemy();
}