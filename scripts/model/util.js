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
const BASIC_ENEMY_DAMAGE = 3;
const BASIC_ENEMY_MIN_DELTA_NEG = -30; // min negative velocity
const BASIC_ENEMY_MAX_DELTA_NEG = -15; // max negative velocity
const BASIC_ENEMY_MIN_DELTA = 15; // min postive velocity
const BASIC_ENEMY_MAX_DELTA = 30; // max postive velocity
//const BASIC_ENEMY_BOUNCE_FACTOR = -1.009; // how much to change enemy velocity upon collision with another
const BASIC_ENEMY_THROWN_SPEED = 10;
const BASIC_ENEMY_NORMAL_SPEED = 25;
const BASIC_ENEMY_CHASE_FACTOR = 65; // [0, 100] - the higher, the more aggressively enemy will chase player
const BASIC_ENEMY_REMOVE_TIMEOUT = 3000 // in msec

const POWER_UP_HITBOX_HEIGHT = 35;
const POWER_UP_HITBOX_WIDTH = 35;

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
const PLAYER_INITIAL_X_POS = 650;
const PLAYER_INITIAL_Y_POS = 380;

/*
Names of all files in ./images/decoration
Any names file named here as a chance to appear as 
a random decoration on the board
*/
// small decorations: ~15px x 15px
const DECORATION_SMALL_NAME_LIST = [
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

const DECORATION_COLLIDABLE_NAME_LIST = [
    "tall_lantern_unlit_collidable"
]

var DIAMOND = [[640,175], [640,425], [440,300], [840 , 300]];
var CIRCLE = [[640,175], [640,425], [440,300], [840 , 300], [500, 400], [500, 200], [770, 400], [770, 200]];
var RECTANGLE_LONG = [[240, 175], [440,175], [640,175], [840,175], [1040, 175], [240, 350], [440,350], [640,350], [840,350], [1040, 350]];
var RECTANGLE_SPACED = [[240, 175], [640,175], [1040, 175], [440,350], [840,350]];
function randomPosition() {
    var a = getRndInteger(0, 3); // range [0, number of cases]
    switch(a) {
        case 0: return DIAMOND;
        case 1: return RECTANGLE_LONG;
        case 2: return RECTANGLE_SPACED;
        case 3: return CIRCLE;
    }
}

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

function isCollideDecoration(player, collidable_decoration, decor_xPos, decor_yPos) {
    return !(
        ((player.yPos + player.hitboxHeight) < (decor_yPos)) ||
        (player.yPos > (decor_yPos + collidable_decoration.hitboxHeight)) ||
        ((player.xPos + player.hitboxWidth) < decor_xPos) ||
        (player.xPos > (decor_xPos + collidable_decoration.hitboxWidth))
    );
}

// for testing...
function buttonSpawn() {
    gameState.spawnBasicEnemy(640, 50);

}
function killPlayer() {
    gameState.player.health = 0;
    
}
function buttonSpawnPowerUp(){
    gameState.spawnPowerUp(640, 50);
    console.log("pressed");
}

