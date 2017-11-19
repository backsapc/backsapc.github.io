class Bullet extends Entity {
    constructor() {
        super();
        this.moveX = 0;
        this.moveY = 0;
        this.delay = 150;
        this.angle = 0;
        this.speed = 14;
    }

    draw() {
        getSpriteManager().drawSprite(context, 'tile1', this.posX, this.posY, this.angle);
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
        if(entity.name.includes('enemy')) {
            let e = getGameManager().entity(entity.name);
            if(e !== null) {
                if(e.alive) {
                    // getScoreManager().enemyKilled(entity.difficulty);
                    e.kill();
                }
            }
            this.kill();
        }
    }

    onTouchMap(idx) {
        this.kill();
    }

    kill() {
        getGameManager().kill(this);
    }
}