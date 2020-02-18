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
    this.speedIncrement = 25;

    //this.distanceFromPlayer = 500; // init to large number
    //this.playerXPos = 0;
    //this.playerYPos = 0;

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

    this.updateDeltaTracked = function() {
        var nextXPos = 5 * (this.xPos + this.dx);
        var nextYPos = 5 * (this.yPos + this.dy);
        this.dx = this.speedIncrement;
        this.dy = this.speedIncrement;

        if ( (Math.abs(nextXPos - this.playerXPos)+Math.abs(this.yPos - this.playerYPos)) < this.distanceFromPlayer ) {
            this.dx *= 1;
            this.dy *= 0;
            this.angle = EAST;
        } 
        else if ((Math.abs(nextXPos - this.playerXPos)+Math.abs(this.yPos - this.playerYPos)) > this.distanceFromPlayer) {
            this.dx *= -1;
            this.dy *= 0;
            this.angle = WEST;
        }
        else if ((Math.abs(this.xPos - this.playerXPos)+Math.abs(nextYPos - this.playerYPos)) < this.distanceFromPlayer) {
            this.dx *= 0;
            this.dy *= 1;
            this.angle = SOUTH;
        }
        else if ((Math.abs(this.xPos - this.playerXPos)+Math.abs(nextYPos - this.playerYPos)) > this.distanceFromPlayer) {
            this.dx *= 0;
            this.dy *= -1;
            this.angle = NORTH;
        }
    }

    this.updateDeltaTracked2 = function() {
        var nextXPos = 2 * (this.xPos + this.dx);
        var nextYPos = 2 * (this.yPos + this.dy);
        this.dx = this.speedIncrement;
        this.dy = this.speedIncrement;

        if ((Math.abs(nextXPos - this.playerXPos)+Math.abs(this.yPos - this.playerYPos)) > this.distanceFromPlayer) {
            this.dx *= -1;
            this.dy *= 0;
            this.angle = WEST;
        }
        else if ((Math.abs(this.xPos - this.playerXPos)+Math.abs(nextYPos - this.playerYPos)) > this.distanceFromPlayer) {
            this.dx *= 0;
            this.dy *= -1;
            this.angle = NORTH;
        }
    }

    this.updatePosition = function() {
        //this.updateDeltaTracked();
        // change direction after a random number ofs steps
        if (this.step % (Math.floor(getRndInteger(400, 600) / 2)) == 0 && this.alive) {
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

        //this.distanceFromPlayer = Math.abs(this.xPos - this.playerXPos) + Math.abs(this.yPos - this.playerYPos);
        //console.log(this.distanceFromPlayer)
    }
}