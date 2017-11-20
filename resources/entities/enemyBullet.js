class EnemyBullet extends Entity {
    constructor() {
        super();
        this.delay = 600;
        this.speed = 16;
    }

    draw() {
        getSpriteManager().drawSprite(context, 'bullet', this.posX, this.posY, this.angle);
    }

    update() {
        getPhysicManager().update(this);
    }

    onTouchEntity(entity) {
        if(entity.name.includes('player')) {
            let dist = Math.sqrt(
                Math.pow((this.posX + this.sizeX/2) - (entity.posX + entity.sizeX/2), 2) +
                Math.pow((this.posY + this.sizeY/2) - (entity.posY + entity.sizeY/2), 2));
            if( dist < 15 ) {
                    console.log(`KILLED PLAYER`);
                    getGameManager().reloadScene();
                this.kill();
            }
        }
    }

    lazyUpdate(){
        let history = this.speed;
        this.speed = history * 0.01;
        getPhysicManager().update(this);
        this.speed = history;
    }

    onTouchMap(idx) {
        this.kill();
    }

    kill() {
        getGameManager().kill(this);
    }
}