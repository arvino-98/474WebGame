function Decoration(id, name, width, height, hboxWidth, hboxHeight, xPos, yPos, rotation, obstacle) {
    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    this.hitboxWidth = hboxWidth;
    this.hitboxHeight = hboxHeight;
    this.xPos = xPos;
    this.yPos = yPos;
    this.rotation = rotation;
    this.obstacle = obstacle; // true if collision logic, else false
}