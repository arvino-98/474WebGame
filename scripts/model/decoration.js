function Decoration(id, name, width, height, hboxWidth, hboxHeight, xPos, yPos, rotation, collidable) {
    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    this.hitboxWidth = hboxWidth;
    this.hitboxHeight = hboxHeight;
    this.xPos = xPos;
    this.yPos = yPos;
    this.rotation = rotation;
    this.collidable = collidable; // true if collision logic, else false
    this.collided = false; // initially false, should set true after first collision
}