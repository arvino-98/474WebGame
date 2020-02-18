const MIN_D_NEG = -15;
const MAX_D_NEG = -13;
const MIN_D = 13;
const MAX_D = 15;

function BasicEnemy(id, width, height, hboxWidth, hboxHeight, xPos, yPos, dx, dy, strength, health) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.hitboxWidth = hboxWidth;
    this.hitboxHeight = hboxHeight;
    this.xPos = xPos;
    this.yPos = yPos;
    this.dx = dx;
    this.dy = dy;
    this.strength = strength; // future use?
    this.health = health; // future use?
    this.alive = true;
    this.moving = false;
    this.step = 0;
    this.spritePos = PLAYER_WIDTH / 4; // fix later...
    this.angle = 0;

    this.updateDelta = function() {
        var a = getRndInteger(0, 3); // range [0, number of cases]

        switch(a) {
            case 0:
                this.dx = getRndInteger(MIN_D_NEG, MAX_D_NEG);
                this.dy *= 0;
                this.angle = WEST;
                break;
            case 1:
                this.dx = getRndInteger(MIN_D, MAX_D);
                this.dy *= 0;
                this.angle = EAST;
                break;
            case 2:
                this.dy = getRndInteger(MIN_D_NEG, MAX_D_NEG);
                this.dx *= 0;
                this.angle = NORTH;
                break;
            case 3:
                this.dy = getRndInteger(MIN_D, MAX_D);
                this.dx *= 0;
                this.angle = SOUTH;
                break;
        }
    }

    this.updatePosition = function() {
        // change direction after a random number ofs steps
        if (this.step % (Math.floor(getRndInteger(600, 800) / 2)) == 0 && this.alive) {
            this.updateDelta();
            this.dx *= gameState.environment.ground_drag_force;
            this.dy *= gameState.environment.ground_drag_force;
        }

        var nextXPos = this.xPos + this.dx;
        var nextYPos = this.yPos + this.dy;

        this.moving = nextXPos != this.xPos || nextYPos != this.yPos;
        if (this.moving) { this.step = (this.step + 1); }

        // make sure enemy stays within board boundaries while alive
        if (this.alive) {
            if (nextXPos >= 0 && nextXPos + this.width <= BOARD_WIDTH) {
                this.xPos = nextXPos;
            } else {
                this.dx *= -1;
                this.angle *= -1;
            }
            if (nextYPos >= 0 && nextYPos + this.height <= BOARD_HEIGHT) {
                this.yPos = nextYPos;
            } else {
                this.dy *= -1;
                this.angle *= -1;
            }
        }
        else if (!this.alive){
            this.xPos = nextXPos;
            this.yPos = nextYPos;
        }
    }
}