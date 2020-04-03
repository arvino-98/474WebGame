function CasterProjectile(id, width, height, hboxWidth, hboxHeight, xPos, yPos, dx, dy) {
    this.id = id;

    this.width = width;
    this.height = height;
    this.hitboxWidth = hboxWidth;
    this.hitboxHeight = hboxHeight;
    this.xPos = xPos;
    this.yPos = yPos;
    this.dx = dx;
    this.dy = dy;

    this.damage = CASTER_P_ENEMY_DAMAGE;
    this.lifespan = CASTER_P_ENEMY_LIFESPAN; // how long projectile stays in game
    this.outsideBoard = false;

    // probably unnecessary
    this.updateDelta = function() {

    }

    this.update = function() {
        var nextXPos = this.xPos + this.dx;
        var nextYPos = this.yPos + this.dy;

        // make sure projectile stays within board boundaries
        if (nextXPos <= 0 || nextXPos + this.width >= BOARD_WIDTH || nextYPos <= 0 || nextYPos + this.height >= BOARD_HEIGHT) {
            this.outsideBoard = true;
        } else {
            this.xPos = nextXPos;
            this.yPos = nextYPos; 
        }

        this.lifespan -= 1;
    }

}