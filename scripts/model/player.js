function Player() {
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.hitboxWidth = PLAYER_HITBOX_WIDTH;
    this.hitboxHeight = PLAYER_HITBOX_HEIGHT;
    this.xPos = PLAYER_INITIAL_X_POS;
    this.yPos = PLAYER_INITIAL_Y_POS;
    this.dx = 0;
    this.dy = 0;
    this.speed_increment = PLAYER_NORMAL_SPEED;
    this.moving = false;
    this.step = 0;
    this.attacking = false;
    this.sprinting = false;
    this.stamina = 100;
    this.staminaRechargeRate = 1;
    this.health = 100;
    this.stuck = false;

    /*
    Update player velocity based on key presses
    */
    this.updateDelta = function() {
        if (input.keyHandler.a && !this.stuck) { // handle a
            this.dx = -this.speed_increment;
            this.dy *= 0
        }
        if (input.keyHandler.d && !this.stuck) { // handle d
            this.dx = this.speed_increment;
            this.dy *= 0
        }
        if (input.keyHandler.w && !this.stuck) { // handle w
            this.dy = -this.speed_increment;
            this.dx *= 0
        }
        if (input.keyHandler.s && !this.stuck) { // handle s
            this.dy = this.speed_increment;
            this.dx *= 0
        }
    }

    /*
    Initialize player position and velocities
    */
    this.init = function(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }

    /*
    Update a player's pos and vel.
    */
    this.update = function() {
        // check stamina consuming actions and decrease stamina accordingly
        if (this.health > 0) {

            // handle attacking action
            if (input.keyHandler.space && this.stamina > 0) {
                this.attacking = true;
                this.stamina -= PLAYER_TORNADO_COST;
            } else {
                this.attacking = false;
            }

            // handle sprinting action
            if (input.keyHandler.shift && this.moving && this.stamina > 0) {
                this.sprinting = true;
                this.stamina -= PLAYER_SPRINT_COST;
                this.speed_increment = PLAYER_SPRINT_SPEED;
            } else {
                this.sprinting = false;
                this.speed_increment = PLAYER_NORMAL_SPEED;
            }
        }

        // update dx and dy
        this.updateDelta();
        this.dx *= GROUND_DRAG_FORCE;
        this.dy *= GROUND_DRAG_FORCE;

        // get next positions
        var nextXPos = this.xPos + this.dx;
        var nextYPos = this.yPos + this.dy;

        // increment step if moving
        this.moving = nextXPos != this.xPos || nextYPos != this.yPos;
        if (this.moving) { this.step = (this.step + 1); }

        // make sure player stays within board boundaries
        // if so set the next postions
        if (nextXPos >= 0 && nextXPos + PLAYER_WIDTH <= BOARD_WIDTH) {
            this.xPos = nextXPos;
        }
        if (nextYPos >= 0 && nextYPos + PLAYER_HEIGHT <= BOARD_HEIGHT) {
            this.yPos = nextYPos;
        }

        // if stamina reaches 0 set delay before it starts recharging again
        if (this.stamina <= 0) {
            this.stamina = 0;
            this.staminaRechargeRate = 0;
            setTimeout( ()=>{ 
                this.stamina = 1; this.staminaRechargeRate = PLAYER_STAMINA_RECHARGE_SPEED; 
            }, PLAYER_STAMINA_RECHARGE_DELAY );
        }

        if (this.stamina < 100) { this.stamina += this.staminaRechargeRate; }
    }

}