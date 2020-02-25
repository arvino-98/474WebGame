function CasterEnemy(id, width, height, hboxWidth, hboxHeight, xPos, yPos, dx, dy) {
    this.id = id;

    this.width = width;
    this.height = height;
    this.hitboxWidth = hboxWidth;
    this.hitboxHeight = hboxHeight;
    this.xPos = xPos;
    this.yPos = yPos;
    this.dx = dx;
    this.dy = dy;
    this.min_delta_neg = CASTER_ENEMY_MIN_DELTA_NEG;
    this.max_delta_neg = CASTER_ENEMY_MAX_DELTA_NEG;
    this.min_delta = CASTER_ENEMY_MIN_DELTA;
    this.max_delta = CASTER_ENEMY_MAX_DELTA;

    this.health = -1; // future use?
    this.alive = true;
    this.moving = false;
    this.step = 0;
    this.spritePos = PLAYER_WIDTH / 4; // fix later...
    this.damage = 0;

    this.playerXPos = 0;
    this.playerYPos = 0;
    this.playerDx = 0;
    this.playerDy = 0;

    this.projectileMap = new Map();

    this.spawnProjectile = function() {
        var p = new CasterProjectile(
            "casterProjectile" + getRndInteger(0, 1000000),
            30, 30,
            CASTER_P_ENEMY_HITBOX_WIDTH, CASTER_P_ENEMY_HITBOX_HEIGHT,
            this.xPos, this.yPos,
            this.calculateProjectileDx(), this.calculateProjectileDy()
        ); 
    
        this.projectileMap.set(p.id, p); // add to map
        $('#gameBoard').append("<div class='casterProjectile' id='" + p.id + "'></div>"); // add to html
    }

    this.calculateProjectileDx = function() {
        return (-(this.xPos-this.playerXPos) / CASTER_ENEMY_PROJECTILE_SPEED_DIVISOR) * getRndInteger(1, CASTER_ENEMY_PROJECTILE_VARIANCE);
    }

    this.calculateProjectileDy = function() {
        return (-(this.yPos-this.playerYPos) / CASTER_ENEMY_PROJECTILE_SPEED_DIVISOR) * getRndInteger(1, CASTER_ENEMY_PROJECTILE_VARIANCE);
    }

    this.updateDelta = function() {
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

    this.update = function() {
        var a = getRndInteger(0, 100);
        if (this.step % (Math.floor(getRndInteger(50, 100) / 2)) == 0 && this.alive) {
            if (a <= 5) {
                this.updateDelta();
            } else {
                this.dx = 0;
                this.dy = 0;
            }

            this.dx *= GROUND_DRAG_FORCE;
            this.dy *= GROUND_DRAG_FORCE;
        }

        var b = getRndInteger(0, 100)
        if (this.dx == 0 && this.dy == 0 && b <= 1) {this.spawnProjectile();};

        this.projectileMap.forEach(function (value, key, map) {
            console.log("update: " + value.id)
            value.update();
            if (value.lifespan <= 0) {
                $('#' + value.id).remove(); // remove from html
                map.delete(value.id); // remove from map
            }
        });

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