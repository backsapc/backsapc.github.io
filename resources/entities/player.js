class Player extends Entity {
    constructor() {
        super();
        this.ammo = 6;
        this.moveX = 1;
        this.moveY = 0;
        this.speed = 5;
        this.canFire = true;
    }

    draw() {
        let mouseDelta = getEventsManager().getMouseDelta();
        let angle = Math.atan2(mouseDelta.y, mouseDelta.x);
        getSpriteManager().drawSprite(context, 'survivor', this.posX, this.posY, angle);
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
        if(entity.name.includes('energy')) {
            if(entity.energyAmount !== 0) {
                this.ammo += entity.energyAmount;
                entity.energyAmount = 0;
                entity.kill();
               // getAudioManager().play('res/sounds/pickup.mp3');
            }
            return;
        }

        if(entity.name.includes('trigger_levelend')) {
            console.log('Completed the level!');
            this.scoreLevel();
            return;
        }

        if(entity.name.includes('trigger_killeveryone')) {
            console.log('Leaving attempt!');
            for(let entity of getGameManager().entities) {
                if(entity.name.includes('enemy')) {
                    console.log('There are more enemies around!');
                    return;
                }
            }
            console.log('Completed the level!');
            this.scoreLevel();
            return;
        }
    }

    scoreLevel() {
        /*
        getScoreManager().recordTime();
        getScoreManager().calculateTotal();
        getGameManager().levelCompleted();
        */
    }

    kill() {

    }

    fire() {
        if(this.canFire && this.ammo !== 0) {
            let bullet = new Bullet();

            bullet.sizeX = 8;
            bullet.sizeY = 4;

            bullet.name = 'bullet' + (++getGameManager().fireNum);

            let mouseDelta = getEventsManager().getMouseDelta();
            let angle = Math.atan2(mouseDelta.y, mouseDelta.x);

            bullet.angle = angle;

            bullet.posX = this.posX + this.sizeX / 2 - 4 + Math.cos(angle) * 4;
            bullet.posY = this.posY + this.sizeY / 2 - 4 + Math.sin(angle) * 4;

            getGameManager().entities.push(bullet);
/*
            getAudioManager().play('res/sounds/shot.mp3');
            getScoreManager().shotFired();
*/
            this.canFire = false;
            setTimeout( () => { getGameManager().player.canFire = true; }, bullet.delay);
        }

    }
}