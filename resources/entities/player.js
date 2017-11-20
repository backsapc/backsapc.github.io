class Player extends Entity {
    constructor() {
        super();
        this.ammo = 6;
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
                this.ammo += entity.energyAmount;
                entity.energyAmount = 0;
                entity.kill();
                getAudioManager().play('resources/sounds/energy-onboard.mp3');
            }
            return;
        }

        if(entity.name.includes('trigger')) {
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

        }
    }

    scoreLevel() {
        getStatisticsManager().recordTime();
        getStatisticsManager().calculateTotal();
        getGameManager().levelCompleted();
    }

    kill() {
        getAudioManager().play('resources/sounds/sad-death.mp3');
    }

    fire() {
        let player = getGameManager().player;
        if(player.canFire && player.ammo !== 0) {
            player.ammo--;
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
         //   getStatisticsManager().shotFired();
            player.canFire = false;
            setTimeout(() => { getGameManager().player.canFire = true; }, bullet.delay);
        }

    }
}