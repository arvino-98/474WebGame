/*
Constant declarations
*/
const BOARD_WIDTH = $('#gameBoard').width();
const BOARD_HEIGHT = $('#gameBoard').height();

const GROUND_DRAG_FORCE = 0.15;
const NUMBER_OF_DECORATIONS = 50; // number of random decorations to appear on board
const GAME_END_TIMEOUT = 4000 // in msec

const BASIC_ENEMY_HITBOX_HEIGHT = 35;
const BASIC_ENEMY_HITBOX_WIDTH = 35;
const BASIC_ENEMY_DAMAGE = 5;
const BASIC_ENEMY_MIN_DELTA_NEG = -30; // min negative velocity
const BASIC_ENEMY_MAX_DELTA_NEG = -15; // max negative velocity
const BASIC_ENEMY_MIN_DELTA = 15; // min postive velocity
const BASIC_ENEMY_MAX_DELTA = 30; // max postive velocity
//const BASIC_ENEMY_BOUNCE_FACTOR = -1.009; // how much to change enemy velocity upon collision with another
const BASIC_ENEMY_THROWN_SPEED = 10;
const BASIC_ENEMY_NORMAL_SPEED = 25;
const BASIC_ENEMY_CHASE_FACTOR = 65; // [0, 100] - the higher, the more aggressively enemy will chase player
const BASIC_ENEMY_REMOVE_TIMEOUT = 3000 // in msec

const PLAYER_HITBOX_HEIGHT = 30;
const PLAYER_HITBOX_WIDTH = 30;
const PLAYER_WIDTH = $('#player').width();
const PLAYER_HEIGHT = $('#player').height();
const PLAYER_NORMAL_SPEED = 35;
const PLAYER_SPRINT_SPEED = 55;
const PLAYER_SPRINT_COST = 1.5; // stamina cost of sprint
const PLAYER_TORNADO_COST = 3; // stamina cost of tornado attack
const PLAYER_STAMINA_RECHARGE_DELAY = 1500; // in msec
const PLAYER_STAMINA_RECHARGE_SPEED = .6;
const PLAYER_INITIAL_X_POS = 640;
const PLAYER_INITIAL_Y_POS = 620;

/*
Names of all files in ./images/decoration
Any names file named here as a chance to appear as 
a random decoration on the board
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
    gameState.spawnBasicEnemy(640, 50);
}
function killPlayer() {
    gameState.player.health = 0;
}

