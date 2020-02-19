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
    this.min_delta_neg = BASIC_ENEMY_MIN_DELTA_NEG;
    this.max_delta_neg = BASIC_ENEMY_MAX_DELTA_NEG;
    this.min_delta = BASIC_ENEMY_MIN_DELTA;
    this.max_delta = BASIC_ENEMY_MAX_DELTA;

    this.health = health; // future use?
    this.alive = true;
    this.moving = false;
    this.step = 0;
    this.spritePos = PLAYER_WIDTH / 4; // fix later...
    this.angle = 0;
    this.damage = BASIC_ENEMY_DAMAGE;

    //this.distanceFromPlayer = 500; // init to large number
    //this.playerXPos = 0;
    //this.playerYPos = 0;

    this.updateDelta = function() {
        var a = getRndInteger(0, 3); // range [0, number of cases]

        switch(a) {
            case 0:
                this.dx = getRndInteger(this.min_delta_neg, this.max_delta_neg);
                this.dy *= 0;
                this.angle = WEST;
                break;
            case 1:
                this.dx = getRndInteger(this.min_delta, this.max_delta);
                this.dy *= 0;
                this.angle = EAST;
                break;
            case 2:
                this.dy = getRndInteger(this.min_delta_neg, this.max_delta_neg);
                this.dx *= 0;
                this.angle = NORTH;
                break;
            case 3:
                this.dy = getRndInteger(this.min_delta, this.max_delta);
                this.dx *= 0;
                this.angle = SOUTH;
                break;
        }
    }

    this.updatePosition = function() {
        // change direction after a random number ofs steps
        if (this.step % (Math.floor(getRndInteger(400, 600) / 2)) == 0 && this.alive) {
            this.updateDelta();
            this.dx *= GROUND_DRAG_FORCE;
            this.dy *= GROUND_DRAG_FORCE;
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