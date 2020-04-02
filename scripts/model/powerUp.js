function powerUp(id, width, height, hboxWidth, hboxHeight, xPos, yPos) {
    this.id = id;

    this.width = width;
    this.height = height;
    this.hitboxWidth = hboxWidth;
    this.hitboxHeight = hboxHeight;
    this.xPos = xPos;
    this.yPos = yPos;


    this.randomPowerUp = function() {
        var r = getRndInteger(0,2);

        switch(r){
            case 0:
                //power up 1
                break;
            case 1:
                //power up 2
                break;
            case 2:
                //power up 3
                break;
        }
    }

    this.randomInt = function(){
        Math.floor(Math.random() * 301) + 500;
    }


}