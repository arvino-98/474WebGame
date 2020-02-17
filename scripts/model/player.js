PLAYER_WIDTH = $('#player').width();
PLAYER_HEIGHT = $('#player').height();

function Player() {
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.hitboxWidth = 20;
    this.hitboxHeight = 20;
    this.xPos = 0;
    this.yPos = 0;
    this.dx = 0;
    this.dy = 0;
    this.speed_increment = 15;
    this.angle = 0;
    this.moving = false;
    this.step = 0;

    /*
    Update player velocity based on key presses
    */
    this.updateDelta = function() {
        if (input.keyHandler.a) { // handle a
            this.dx = -this.speed_increment;
            this.dy *= 0
            this.angle = WEST;
        }
        if (input.keyHandler.d) { // handle d
            this.dx = this.speed_increment;
            this.dy *= 0
            this.angle = EAST;
        }
        if (input.keyHandler.w) { // handle w
            this.dy = -this.speed_increment;
            this.dx *= 0
            this.angle = NORTH;
        }
        if (input.keyHandler.s) { // handle s
            this.dy = this.speed_increment;
            this.dx *= 0
            this.angle = SOUTH;
        }
    }

    /*
    Initialize player position and velocities
    */
    this.init = function() {
        this.xPos = 0;
        this.yPos = 0;
        this.dx = 0;
        this.dy = 0;
    }

    /*
    Update a player's pos and vel.
    */
    this.update = function() {
        this.updateDelta();

        this.dx *= gameState.environment.ground_drag_force;
        this.dy *= gameState.environment.ground_drag_force;

        //console.log(this.angle);
        var nextXPos = this.xPos + this.dx;
        var nextYPos = this.yPos + this.dy;

        this.moving = nextXPos != this.xPos || nextYPos != this.yPos;
        if (this.moving) { this.step = (this.step + 1); }
        //console.log(this.step);

        // make sure player stays within board boundaries
        if (nextXPos >= 0 && nextXPos + PLAYER_WIDTH <= BOARD_WIDTH) {
            this.xPos = nextXPos;
        }
        if (nextYPos >= 0 && nextYPos + PLAYER_HEIGHT <= BOARD_HEIGHT) {
            this.yPos = nextYPos;
        }
    }

}