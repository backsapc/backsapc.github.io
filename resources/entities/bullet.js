class Bullet extends Entity {
    constructor() {
        super();
        this.delay = 150;
        this.speed = 14;
    }

    draw() {
        getSpriteManager().drawSprite(context, 'bullet', this.posX, this.posY, this.angle);
    }

    update() {
        getPhysicManager().update(this);
    }

    lazyUpdate(){
        let history = this.speed;
        this.speed = history * 0.01;
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