/*
Constant declarations
*/
const BOARD_WIDTH = $('#gameBoard').width();
const BOARD_HEIGHT = $('#gameBoard').height();

const NORTH = 2;
const EAST = -1;
const SOUTH = -2;
const WEST = 1;

const GROUND_DRAG_FORCE = 0.15;
const NUMBER_OF_DECORATIONS = 40;

const BASIC_ENEMY_HITBOX_HEIGHT = 35;
const BASIC_ENEMY_HITBOX_WIDTH = 35;
const BASIC_ENEMY_DAMAGE = 2;
const BASIC_ENEMY_MIN_DELTA_NEG = -30;
const BASIC_ENEMY_MAX_DELTA_NEG = -15;
const BASIC_ENEMY_MIN_DELTA = 15;
const BASIC_ENEMY_MAX_DELTA = 30;
const BASIC_ENEMY_BOUNCE_FACTOR = -1.009; // how much to change enemy velocity upon collision with another
const BASIC_ENEMY_THROWN_SPEED = 10;

const PLAYER_HITBOX_HEIGHT = 30;
const PLAYER_HITBOX_WIDTH = 30;
const PLAYER_WIDTH = $('#player').width();
const PLAYER_HEIGHT = $('#player').height();
const PLAYER_NORMAL_SPEED = 35;
const PLAYER_SPRINT_SPEED = 55;
const PLAYER_SPRINT_COST = 1.5;
const PLAYER_TORNADO_COST = 3;
const PLAYER_STAMINA_RECHARGE_DELAY = 1000; // in msec
const PLAYER_STAMINA_RECHARGE_SPEED = .3;

/*
Names of all files in ./images/decoration
*/
const DECORATION_NAME_LIST = [
    "bones1",
    "bones2",
    "bones3",
    "bones4",
    "rock1",
    "rock2",
    "rock3",
    "rock4",
    "rock5",
    "root1",
    "root2",
    "sticks1"
];

/*
General utility functions below...
*/

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
function killPlayer() {
    gameState.player.health = 0;
}

