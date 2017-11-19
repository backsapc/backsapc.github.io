class mapManager {

    constructor() {
        this.mapData = null;
        this.tileLayer = null;
        this.xCount = 0;
        this.yCount = 0;
        this.tSize = {x: 32, y: 32};
        this.scale = 1;
        this.mapSize = {x: 32, y: 32};
        this.tilesets = [];
        this.camera = {x: 0, y: 0, w: 900, h: 768};
        this.imagesLoadCounter = 0;
        this.imagesLoaded = false;
        this.jsonLoaded = false;
    }

    loadMap(path) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                this.parseMap(request.responseText);
            }
        };
        request.open('GET', path, true);
        request.send();
        this.camera.w = getCurrentCanvas().width;
        this.camera.h = getCurrentCanvas().height;
    }


    parseMap(data) {
        this.mapData = JSON.parse(data);

        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;

        this.tSize.x = this.mapData.tileheight;
        this.tSize.y = this.mapData.tilewidth;

        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;

        for(let tileset of this.mapData.tilesets) {
            let img = new Image();
            img.onload = () => {
                this.imagesLoadCounter++;
                if(this.imagesLoadCounter === this.mapData.tilesets.length) {
                    this.imagesLoaded = true;
                    console.log('Tilesets are loaded');
                }
            };
            img.src = 'resources/images/' + tileset.image;
            let selfTileset = {
                firstgid: tileset.firstgid,
                image: img,
                name: tileset.name,
                xCount: Math.floor(tileset.imagewidth / this.tSize.x),
                yCount: Math.floor(tileset.imageheight / this.tSize.y)
            };
            this.tilesets.push(selfTileset);
        }

        for(let layer of this.mapData.layers) {
            if(layer.type === "tilelayer") {
                this.tileLayer = layer;
                break;
            }
        }

        this.jsonLoaded = true;
        console.log('Map json loaded');

    }

    draw(canvasContext) {

        if(!this.imagesLoaded || !this.jsonLoaded) {
            setTimeout( () => this.draw(canvasContext), 100 );
            return;
        }

        if(this.tileLayer === null) {
            for(let layer of this.mapData.layers) {
                if(layer.type === "tilelayer") {
                    this.tileLayer = layer;
                    break;
                }
            }
        }

        for(let i = 0; i < this.tileLayer.data.length; i++) {
            let tileData = this.tileLayer.data[i];
            if(tileData === 0)
                continue;
            let tile = this.getTile(tileData);
            let {pX, pY} = this.getTileCoordinates(i);
            pX *= this.scale;
            pY *= this.scale;
            let tileSizeX = this.tSize.x * this.scale;
            let tileSizeY = this.tSize.y * this.scale;
            if( !this.isVisible(pX, pY, tileSizeX, tileSizeY) )
                continue;
            pX -= this.camera.x;
            pY -= this.camera.y;
            canvasContext.drawImage(tile.img,
                          tile.px,
                          tile.py,
                          this.tSize.x,
                          this.tSize.y,
                          pX,
                          pY,
                          tileSizeX,
                          tileSizeY);
        }
    }

    getTileCoordinates(i) {
        let pX = (i % this.xCount) * this.tSize.x;
        let pY = Math.floor(i / this.xCount) * this.tSize.y;
        return {pX, pY};
    }

    parseEntities() {
        if(!this.imagesLoaded || !this.jsonLoaded) {
            return false;
        }
        console.log('parsing entities');
        for(let layer of this.mapData.layers) {
            if(layer.type === 'objectgroup') {
                for(let entity of layer.objects) {
                    try {
                        let obj = null;

                        switch(entity.type) {
                            case 'Player':
                                obj = new Player();
                                obj.ammo = entity.properties.ammo;
                                break;

                            case 'Enemy':
                                obj = new Enemy();
                                obj.difficulty = entity.properties.difficulty;
                                break;

                            case 'PlayerTrigger':
                                obj = new Trigger();
                                break;
                        }

                        if(obj === null) continue;

                        //let obj = Object.create(getGameManager().factory[entity.type]);
                        obj.name = entity.name;
                        obj.posX = entity.x;
                        obj.posY = entity.y - entity.height; // КОСТЫЛЬ!!!
                        obj.sizeX = entity.width;
                        obj.sizeY = entity.height;

                        getGameManager().entities.push(obj);

                        if(obj.name === 'player') {
                            getGameManager().initPlayer(obj);
                        }

                        console.log(`Entity loaded: ${entity.type}, ${entity.name}`);
                    } catch(ex) {
                        console.log(`Error while creating [${entity.gid}] ${entity.type}, ${ex}`);
                    }
                }
            }
        }
    }

    centerAt(x, y) {
        this.camera.x = this.getCenterCoordinate(this.camera.w, x, this.mapSize.x);
        this.camera.y = this.getCenterCoordinate(this.camera.h, y, this.mapSize.y);

        //console.log(`Center at (${x}, ${y})`);
    }

    getCenterCoordinate(size, dimension, mapDimension){
        if(dimension < size / 2) {
            return 0;
        }
        if(dimension > mapDimension - size / 2) {
            return mapDimension - size;
        }
        return dimension - (size / 2);
    }

    getTile(tileIndex) {
        let tile = {
            img: null,
            px: 0,
            py: 0
        };
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;
        return tile;
    }

    getTileset(tileIndex) {
        for(let i = this.tilesets.length-1; i >= 0; i--) {
            if(this.tilesets[i].firstgid <= tileIndex) {
                return this.tilesets[i];
            }
        }
        return null;
    }

    getTilesetIdx(x, y) {
        let wX = x;
        let wY = y;
        let idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);

        return this.tileLayer.data[idx];
    }

    isVisible(x, y, width, height) {
        let isVisible = !(x + width < this.camera.x
            || y + height < this.camera.y
            || x > this.camera.x + this.camera.w
            || y > this.camera.y + this.camera.h);

        return isVisible;
    }
}


