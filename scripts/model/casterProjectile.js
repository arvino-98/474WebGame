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

    // probably unnecessary
    this.updateDelta = function() {

    }

    this.update = function() {
        this.xPos += this.dx;
        this.yPos += this.dy;
        this.lifespan -= 1;
    }

}