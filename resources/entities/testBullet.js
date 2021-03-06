class TestBullet extends Entity {
    constructor() {
        super();
        this.delay = 200;
        this.angle = null;
        this.speed = 20;
        this.creator = null;
    }

    draw() {
        //spriteManager.drawSprite(context, 'bullet', this.posX, this.posY);
    }

    update() {
        getPhysicManager().update(this);
    }

    lazyUpdate(){
        getPhysicManager().update(this);
    }

    onTouchEntity(entity) {
        if(entity.name.includes('player')) {
            let entity = getGameManager().entity(this.creator);
            if(entity !== null) entity.noObstacles = true;
            this.kill();
        }
    }

    onTouchMap(idx) {
        let entity = getGameManager().entity(this.creator);
        if(entity !== null) entity.noObstacles = false;
        this.kill();
    }

    kill() {
        getGameManager().kill(this);
    }
}