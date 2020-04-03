/*
Constant declarations
*/

const BOARD_WIDTH = $('#gameBoard').width();
const BOARD_HEIGHT = $('#gameBoard').height();

const GROUND_DRAG_FORCE = 0.15;
const NUMBER_OF_DECORATIONS = 50; // number of random decorations to appear on board
const GAME_END_TIMEOUT = 4000 // in msec

/* Constants for basic enemy */
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
const BASIC_ENEMY_CHASE_FACTOR = 80; // [0, 100] - the higher, the more aggressively enemy will chase player
const BASIC_ENEMY_REMOVE_TIMEOUT = 3000 // in msec

const POWER_UP_HITBOX_WIDTH = 32;
const POWER_UP_HITBOX_HEIGHT = 32;

/* Constants for caster enemy */
const CASTER_ENEMY_HITBOX_HEIGHT = 35;
const CASTER_ENEMY_HITBOX_WIDTH = 35;
const CASTER_ENEMY_DAMAGE = 0;
const CASTER_ENEMY_MIN_DELTA_NEG = -30; // min negative velocity
const CASTER_ENEMY_MAX_DELTA_NEG = -15; // max negative velocity
const CASTER_ENEMY_MIN_DELTA = 15; // min postive velocity
const CASTER_ENEMY_MAX_DELTA = 30; // max postive velocity
const CASTER_ENEMY_THROWN_SPEED = 10;
const CASTER_ENEMY_NORMAL_SPEED = 25;
const CASTER_ENEMY_CHASE_FACTOR = 65; // [0, 100] - the higher, the more aggressively enemy will chase player
const CASTER_ENEMY_REMOVE_TIMEOUT = 3000 // in msec
const CASTER_ENEMY_PROJECTILE_VARIANCE = 3; // higher number leads to more spread for spawned projectiles
const CASTER_ENEMY_PROJECTILE_SPEED_DIVISOR = 25; // higher number leads to slower projectiles

/* Constants for caster projectiles*/
const CASTER_P_ENEMY_HITBOX_HEIGHT = 5;
const CASTER_P_ENEMY_HITBOX_WIDTH = 5;
const CASTER_P_ENEMY_DAMAGE = 2;
const CASTER_P_ENEMY_LIFESPAN = 150; // how long projectile lasts in game

const PLAYER_HITBOX_HEIGHT = 30;
const PLAYER_HITBOX_WIDTH = 30;
const PLAYER_WIDTH = $('#player').width();
const PLAYER_HEIGHT = $('#player').height();
const PLAYER_NORMAL_SPEED = 35;
const PLAYER_SPRINT_SPEED = 55;
const PLAYER_SPRINT_COST = 1.2; // stamina cost of sprint
const PLAYER_TORNADO_COST = 1.5; // stamina cost of tornado attack
const PLAYER_STAMINA_RECHARGE_DELAY = 1500; // in msec
const PLAYER_STAMINA_RECHARGE_SPEED = .6;
const PLAYER_INITIAL_X_POS = 650;
const PLAYER_INITIAL_Y_POS = 380;



/*
Names of all files in ./images/decoration
Any names file named here as a chance to appear as 
a random decoration on the board
small decorations: ~15px x 15px
*/
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
/* 
Possible set positions for decorations.
[ [xPos, yPos], ... ]
*/
const DIAMOND = [[640,175], [640,425], [440,300], [840 , 300]];
const CIRCLE = [[640,175], [640,425], [440,300], [840 , 300], [500, 400], [500, 200], [770, 400], [770, 200]];
const RECTANGLE_LONG = [[240, 175], [440,175], [640,175], [840,175], [1040, 175], [240, 350], [440,350], [640,350], [840,350], [1040, 350]];
const RECTANGLE_SPACED = [[240, 150], [640,150], [1040, 175], [440,325], [840,325]];
const CORNERS = [[200, 20], [1100, 20], [200, 520], [1100, 520]];
const CORNERS_CIRCLE = [[200, 20], [1100, 20], [200, 520], [1100, 520], [640,175], [640,425], [440,300], [840 , 300], [500, 400], [500, 200], [770, 400], [770, 200]];
/*
randomPosition()
returns a random position array
*/
function randomPosition() {
    var a = getRndInteger(0, 3); // range [0, number of cases+1]
    switch(a) {
        case 0: return DIAMOND;
        case 1: return RECTANGLE_SPACED;
        case 2: return CORNERS;
    }
}


/*
Possible backgrounds
*/
const BACKGROUNDS = [
    "forest_back",
    "dungeon_back",
    "beach_back",
    "ice_back2",
    "lava_back"
];
/*
setRandomBackground()
sets a random background image
*/
function setRandomBackground() {
    var a = BACKGROUNDS[getRndInteger(0, BACKGROUNDS.length)];
    $("#gameBoard").css("background", "url('../images/backgrounds/" + a + ".png')")
}
function getRandomBackground() {
    var a = BACKGROUNDS[getRndInteger(0, BACKGROUNDS.length)];
    return a;
}
function setBackground(backgroundName) {
    $("#gameBoard").css("background", "url('../images/backgrounds/" + backgroundName + ".png')")
} 


/*
Possible enemy spawn locations
*/
const ENEMY_SPAWN_LOCATIONS = [
    [590, 0],
    [0, 300],
    [1150, 300]
]

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
function buttonSpawnBasic() {
    gameState.spawnBasicEnemy(640, 50);
}
function buttonSpawnCaster() {
    gameState.spawnCasterEnemy(450, 50);
}
function killPlayer() {
    gameState.player.health = 0;
}
function gameStateInit() {
    gameState.init();
}
function spawnDoor() {
    // spawn door by lighting all pillars
    gameState.unlitPillars = 0;
}
function buttonSpawnPowerUp(){
    gameState.spawnPowerUp(640, 50);
}

