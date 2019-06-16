import SpritePool from './SpritePool'
import CoordPlayerLookup from './CoordPlayerLookup'

const GRID_WIDTH = 50;
const GRID_HEIGHT = 50;


export default class Grid {

    constructor(app, spriteFactory) {
        this.app = app;
        this.spritePool = new SpritePool(spriteFactory);
    }

    redraw(players, localPlayer, allFood) {
        const coordPlayerLookup = new CoordPlayerLookup(players, allFood);

        this.spritePool.returnAll();

        const centerCoord = localPlayer.head.coords;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const screenCenter = { x: screenWidth / 2, y: screenHeight / 2 };

        const blockSize = this.calculateBlockSize(screenWidth, screenHeight);
        const halfBlock = blockSize / 2;

        // the screen spans in terms of block size
        // @TODO: Edge case for even/odd sizes?
        let xSpan = Math.floor(screenWidth / blockSize);
        let ySpan = Math.floor(screenHeight / blockSize);

        if (this.isEven(xSpan)) xSpan++;
        if (this.isEven(ySpan)) ySpan++;

        const halfXSpan = Math.floor(xSpan / 2);
        const halfYSpan = Math.floor(ySpan / 2);

        const minX = centerCoord.x - (halfXSpan);
        const maxX = centerCoord.x + (halfXSpan);

        const minY = centerCoord.y - (halfYSpan);
        const maxY = centerCoord.y + (halfYSpan);

        function worldToScreenCoord(coord) {
            const x = (coord.x - minX) * blockSize;
            const y = (coord.y - minY) * blockSize;

            return { x, y };
        }

        for (let x = minX; x <= maxX; x += 1) {
            for (let y = minY; y <= maxY; y += 1) {
                const screenCoord = worldToScreenCoord({ x, y });

                const coords = {x, y};
                const playerOnTile = coordPlayerLookup.playerForCoords(coords); 
                const foodOnTile = coordPlayerLookup.foodForCoords(coords)

                //@TODO: refactor?
                if (playerOnTile)
                {
                    const sprite = this.spritePool.get('block');
                    sprite.x = screenCoord.x;
                    sprite.y = screenCoord.y;
    
                    sprite.scale.x = blockSize / sprite.width;
                    sprite.scale.y = blockSize / sprite.width;
                    
                    this.app.stage.addChild(sprite);
                }                

                if (foodOnTile) {
                    const sprite = this.spritePool.get('food');
                    sprite.x = screenCoord.x;
                    sprite.y = screenCoord.y;

                    sprite.scale.x = blockSize / sprite.width;
                    sprite.scale.y = blockSize / sprite.width;

                    this.app.stage.addChild(sprite);
                }
            }
        }        
    }

    getCoordToPlayer(players) {
        const coordToPlayers = Map();
        players.forEach(player => {
            
        });
    }

    isEven = (num) => num % 2 == 0;

    calculateBlockSize(screenWidth, screenHeight) {
        const byWidth = screenWidth / (GRID_WIDTH);
        const byHeight = screenHeight / (GRID_HEIGHT);
        return Math.max(
            Math.floor(byWidth),
            Math.floor(byHeight));
    }    

    playerOccupiesCoord(segment, coord) {
        if (segment.coords.x == coord.x && segment.coords.y == coord.y) return true;
        if (segment.next != null) return this.playerOccupiesCoord(segment.next, coord);
        return false;
    }

    spriteForPlayer(player) {
        return this.spritePool.get();
    }

    drawCenter(centerCoord, worldToScreenCoord, blockSize) {
        const sprite = this.spritePool.get('square');
        const screenCoord = worldToScreenCoord(centerCoord);
        sprite.x = screenCoord.x;
        sprite.y = screenCoord.y;

        sprite.scale.x = blockSize / sprite.width;
        sprite.scale.y = blockSize / sprite.width;
        this.app.stage.addChild(sprite);
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}