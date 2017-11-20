class PhysicsManager {
    constructor() {

    }

    update(obj) {
        if(obj.moveX === 0 && obj.moveY === 0 && obj.angle === null)
            return 'stop';
        let {newX, newY} = this.copmuteNewCoordinates(obj);
        let {newCenterX, newCenterY} = this.updateCenter(newX, obj, newY);
        let {ts, tsX, tsY} = this.getNewPositionTilesets(newCenterX, newCenterY, obj);
        let entity = this.entityAtXY(obj, newX, newY);
        if(entity !== null && obj.onTouchEntity)
            obj.onTouchEntity(entity);

        if(entity !== null && obj.name.includes('enemy')
            && (entity.name.includes('enemy') || entity.name.includes('player')))
            return 'break';

        if(!this.walkable(ts) && obj.onTouchMap)
            obj.onTouchMap(ts);

        if(this.walkable(ts)) {
            obj.posX = newX;
            obj.posY = newY;
            return 'move';
        }

        if(this.walkable(tsX)) {
            obj.posX = newX;
            return 'move'
        }

        if(this.walkable(tsY)) {
            obj.posY = newY;
            return 'move';
        }

        return 'break';
    }

    copmuteNewCoordinates(obj) {
        let newX, newY;

        if (obj.angle === null) {
            newX = obj.posX + Math.floor(obj.moveX * obj.speed);
            newY = obj.posY + Math.floor(obj.moveY * obj.speed);
            return {newX, newY};
        }

        newX = obj.posX + Math.cos(obj.angle) * obj.speed;
        newY = obj.posY + Math.sin(obj.angle) * obj.speed;
        return {newX, newY};
    }

    getNewPositionTilesets(newCenterX, newCenterY, obj) {
        let ts = getMapManager().getTilesetIdx(newCenterX, newCenterY);
        let tsX = getMapManager().getTilesetIdx(newCenterX, Math.floor(obj.posY + obj.sizeY / 2.0));
        let tsY = getMapManager().getTilesetIdx(Math.floor(obj.posX + obj.sizeX / 2.0), newCenterY);
        return {ts, tsX, tsY};
    }

    updateCenter(newX, obj, newY) {
        let newCenterX = Math.floor(newX + obj.sizeX / 2.0);
        let newCenterY = Math.floor(newY + obj.sizeY / 2.0);
        return {newCenterX, newCenterY};
    }

    distance(from, to) {
        return Math.sqrt( Math.pow(from.x - to.x, 2) + Math.pow(from.x - to.y, 2) );
    }

    walkable(idx) {
        let blocks = gameScenes[0].walkable;
        for(let block of blocks) {
            if( idx === block )
                return true;
        }
        return false;
    }

    entityAtXY(obj, x, y) {
        for(let entity of getGameManager().entities) {
            if(entity.name !== obj.name) {
                if(x + obj.sizeX < entity.posX ||
                   y + obj.sizeY < entity.posY ||
                   x > entity.posX + entity.sizeX ||
                   y > entity.posY + entity.sizeY)
                    continue;

                return entity;
            }
        }
        return null;
    }
}