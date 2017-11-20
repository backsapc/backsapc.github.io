class Enemy extends Entity {
    constructor() {
        super();
        this.ammo = 0;
        this.alive = true;
        this.speed = 1;
        this.difficulty = 0.1;
        this.canFire = true;
        this.canTestFire = true;
        this.noObstacles = false;
        this.spotRadius = 200;
        this.minSpotRadius = 200;
        this.playerWasCaught = false;
    }

    draw() {
        if(this.difficulty >= 0.5) {
            getSpriteManager().drawSprite(context, 'survivor-rifle', this.posX, this.posY, this.angle);
        } else {
            getSpriteManager().drawSprite(context, 'survivor-handgun', this.posX, this.posY, this.angle);
        }
    }

    update() {
        let distanceToPlayer = Math.sqrt( Math.pow(this.posX - getGameManager().player.posX, 2)
            + Math.pow(this.posY - getGameManager().player.posY, 2) );
        if( distanceToPlayer < this.minSpotRadius + this.spotRadius * this.difficulty && distanceToPlayer > 0
            || this.playerWasCaught) {
            let playerDelta = {
                x: getGameManager().player.posX - this.posX,
                y: getGameManager().player.posY - this.posY
            };
            let lastAngle = this.angle;
            this.angle = Math.atan2(playerDelta.y, playerDelta.x);
            if(this.angle < 0)
                this.angle += Math.PI * 2;
            this.speed = 3 * this.difficulty;
            this.testFire();
            if(this.noObstacles) {
                this.fire();
                this.playerWasCaught = true;
            }

            if(!this.noObstacles && this.playerWasCaught === true){
                this.angle = lastAngle;
            }

            if(!this.noObstacles && this.playerWasCaught === false) {
                this.angle = lastAngle;
                this.speed = 0;
            }
        } else {
            this.speed = 0;
        }
        getPhysicManager().update(this);
    }

    lazyUpdate(){
        let history = this.speed;
        this.speed = history * 0.01;
        getPhysicManager().update(this);
        this.speed = history;
    }

    testFire() {
        if(this.canTestFire) {
            let sampleBullet = new TestBullet();
            sampleBullet.sizeX = 8;
            sampleBullet.sizeY = 4;
            sampleBullet.name = 'tbullet' + (++getGameManager().fireNum);
            sampleBullet.angle = this.angle;
            sampleBullet.posX = this.posX + this.sizeX / 2;
            sampleBullet.posY = this.posY + this.sizeY / 2;
            sampleBullet.creator = this.name;
            getGameManager().entities.push(sampleBullet);
            this.canTestFire = false;
            setTimeout( () => {
                let entity = getGameManager().entity(this.name);
                if(entity !== null) entity.canTestFire = true;
            }, Math.floor(sampleBullet.delay - 150 * getGameManager().entity(this.name).difficulty * 4));
        }

    }

    onTouchEntity(entity) {

    }

    fire() {
        if(this.canFire) {
            let bullet = new EnemyBullet();

            bullet.sizeX = 8;
            bullet.sizeY = 4;

            bullet.name = 'ebullet' + (++getGameManager().fireNum);

            bullet.angle = this.angle;

            bullet.posX = this.posX;
            bullet.posY = this.posY;

            bullet.posX = this.posX + this.sizeX / 2 - 4 + Math.cos(this.angle) * 4;
            bullet.posY = this.posY + this.sizeY / 2 - 4 + Math.sin(this.angle) * 4;

            getGameManager().entities.push(bullet);

            getAudioManager().playWorldSound('resources/sounds/shoot-sound.mp3', this.posX, this.posY);

            this.canFire = false;
            setTimeout( () => {
                let entity = getGameManager().entity(this.name);
                if(entity !== null) entity.canFire = true;
            }, Math.floor(bullet.delay - 400 * getGameManager().entity(this.name).difficulty));
        }

    }

    kill() {
        this.alive = false;
        getAudioManager().play('resources/sounds/sad-death.mp3');
        let energy = new Energy();
        energy.name = 'energy' + (++getGameManager().fireNum);
        energy.sizeX = 25;
        energy.sizeY = 25;
        energy.posX = this.posX;
        energy.posY = this.posY;
        energy.energyAmount = true ? 2 : 1;
        getGameManager().entities.unshift(energy);
        getGameManager().kill(this);
    }
}