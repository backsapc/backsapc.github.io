class Energy extends Entity {
    constructor() {
        super();
        this.energyAmount = 1;
    }

    draw() {
        if(this.energyAmount > 0) {
            getSpriteManager().drawSprite(context, 'energy1', this.posX + this.sizeX/2,
                this.posY + this.sizeY/2, this.angle + Math.PI / 4);
        }
    }

    update() {
      //  getPhysicManager().update(this);
    }

    lazyUpdate(){

    }

    onTouchEntity(entity) {

    }

    kill() {
        getGameManager().kill(this);
    }
}