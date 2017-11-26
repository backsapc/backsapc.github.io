class Player extends Entity {
    constructor() {
        super();
        this.energyAmount = 6;
        this.speed = 5;
        this.canFire = true;
    }

    draw() {
        let mouseDelta = getEventsManager().getMouseDelta();
        let angle = Math.atan2(mouseDelta.y, mouseDelta.x);
        getSpriteManager().drawSprite(context, 'player-crop', this.posX, this.posY, angle);
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
                this.energyAmount += entity.energyAmount;
                entity.energyAmount = 0;
                entity.kill();
                getAudioManager().play('resources/sounds/energy-onboard.mp3');
            }
            return;
        }

        if(entity.name.includes('trigger')) {
            console.log('Completed the level!');
            this.scoreLevel();

        }
    }

    scoreLevel() {
        getStatisticsManager().recordTime();
        getStatisticsManager().calculateTotal(this.energyAmount);
        getGameManager().levelCompleted();
    }

    kill() {
        getAudioManager().play('resources/sounds/sad-death.mp3');
    }

    fire() {
        let player = getGameManager().player;
        if(player.canFire && player.energyAmount !== 0) {
            player.energyAmount--;
            let bullet = new Bullet();
            bullet.sizeX = 32;
            bullet.sizeY = 16;
            bullet.name = 'bullet' + (++getGameManager().fireNum);
            let mouseDelta = getEventsManager().getMouseDelta();
            let angle = Math.atan2(mouseDelta.y, mouseDelta.x);
            bullet.angle = angle;
            bullet.posX = this.posX + (this.sizeX / 2 + 4) * Math.cos(angle);// * 16;
            bullet.posY = this.posY + (this.sizeY / 2 + 4) * Math.sin(angle);// * 16;

            getGameManager().entities.push(bullet);
            getAudioManager().play('resources/sounds/shoot-sound.mp3');
            player.canFire = false;
            setTimeout(() => { getGameManager().player.canFire = true; }, bullet.delay);
        }

    }
}