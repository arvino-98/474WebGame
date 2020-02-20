function BasicEnemy(id, width, height, hboxWidth, hboxHeight, xPos, yPos, dx, dy) {
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

    this.health = -1; // future use?
    this.alive = true;
    this.moving = false;
    this.step = 0;
    this.spritePos = PLAYER_WIDTH / 4; // fix later...
    this.damage = BASIC_ENEMY_DAMAGE;

    this.playerXPos = 0;
    this.playerYPos = 0;

    /*
    updateDeltaRandom()
    update dx or dy randomly 
    */
    this.updateDeltaRandom = function() {
        var a = getRndInteger(0, 3); // range [0, number of cases]

        switch(a) {
            case 0:
                this.dx = getRndInteger(this.min_delta_neg, this.max_delta_neg);
                this.dy *= 0;
                break;
            case 1:
                this.dx = getRndInteger(this.min_delta, this.max_delta);
                this.dy *= 0;
                break;
            case 2:
                this.dy = getRndInteger(this.min_delta_neg, this.max_delta_neg);
                this.dx *= 0;
                break;
            case 3:
                this.dy = getRndInteger(this.min_delta, this.max_delta);
                this.dx *= 0;
                break;
        }
    }

    /*
    updateDeltaRandom()
    update dx or dy according to enemy's distance from player
    */
    this.updateDeltaTracked = function() {
        var xDistanceFromPlayer = Math.abs(this.xPos - this.playerXPos);
        var yDistanceFromPlayer = Math.abs(this.yPos - this.playerYPos);

        if (xDistanceFromPlayer > yDistanceFromPlayer) {
            if (this.xPos + this.dx > this.playerXPos) {
                this.dx = -BASIC_ENEMY_NORMAL_SPEED;
                this.dy = 0;
            } else if (this.xPos + this.dx < this.playerXPos) {
                this.dx = BASIC_ENEMY_NORMAL_SPEED;
                this.dy = 0;
            }
        }

        else {
            if (this.yPos + this.dy > this.playerYPos) {
                this.dy = -BASIC_ENEMY_NORMAL_SPEED;
                this.dx = 0;
            } else if (this.yPos + this.dy < this.playerYPos) {
                this.dy = BASIC_ENEMY_NORMAL_SPEED;
                this.dx = 0;
            }
        }
    }

    this.update = function() {
        // change direction after random amount of steps
        if (this.step % (Math.floor(getRndInteger(1, 100) / 2)) == 0 && this.alive) {
            var a = getRndInteger(0, 100);
            // either tracked or random update
            // chance determined by BASIC_ENEMY_CHASE_FACTOR
            // higher chase factor leads to more aggressive tracking 
            if (a < BASIC_ENEMY_CHASE_FACTOR){
                this.updateDeltaTracked();
                
            } else {
                this.updateDeltaRandom();
            }

            this.dx *= GROUND_DRAG_FORCE;
            this.dy *= GROUND_DRAG_FORCE;
        }

        // get next x/y position
        var nextXPos = this.xPos + this.dx;
        var nextYPos = this.yPos + this.dy;

        // increment step if moving
        this.moving = nextXPos != this.xPos || nextYPos != this.yPos;
        if (this.moving) { this.step = (this.step + 1); }

        // make sure enemy stays within board boundaries while alive
        // if so set next positions, if not set opposite deltas to move in opposite direction
        if (this.alive) {
            if (nextXPos >= 0 && nextXPos + this.width <= BOARD_WIDTH) {
                this.xPos = nextXPos;
            } else {
                this.dx *= -1;
            }
            if (nextYPos >= 0 && nextYPos + this.height <= BOARD_HEIGHT) {
                this.yPos = nextYPos;
            } else {
                this.dy *= -1;
            }
        }
        // if not alive allow position outside board boundaries
        else if (!this.alive){
            this.xPos = nextXPos;
            this.yPos = nextYPos;
        }
    }

}