class TestBullet extends Entity {
    constructor() {
        super();

        this.moveX = 0;
        this.moveY = 0;
        this.delay = 200;
        this.angle = null;
        this.speed = 20;
        this.creator = null;
    }

    draw() {
        //sm.drawSprite(context, 'bullet', this.posX, this.posY);
    }

    update() {
        getPhysicManager().update(this);
    }

    lazyUpdate(){
        let history = this.speed;
        this.speed = history * 0.1;
        getPhysicManager().update(this);
        this.speed = history;
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