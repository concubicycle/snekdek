import SpritePool from './SpritePool'
import CoordPlayerLookup from './CoordPlayerLookup'
import {Text, Container} from 'pixi.js';

const GRID_WIDTH = 50;
const GRID_HEIGHT = 50;

 

export default class Grid {

    constructor(app, spriteFactory) {
        this.app = app;
        this.spritePool = new SpritePool(spriteFactory);

        this.playerLayer = new Container();
        this.textLayer = new Container();
        this.app.stage.addChild(this.playerLayer);
        this.app.stage.addChild(this.textLayer);

    }

    userIdToText = new Map();

    redraw(state, localPlayer) {
        const players = state.users.filter(u => u.state == 1);

        const deadPlayers = state.users.filter(u => u.state == 0);
        this.hideDeadPlayerText(deadPlayers);

        const allFood = state.allFood;

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

                const outOfBounds = 
                    x <= state.gameBounds.minX 
                    || x >= state.gameBounds.maxX 
                    || y <= state.gameBounds.minY 
                    || y >= state.gameBounds.maxY;

                if (outOfBounds)  this.addSprite('wall', screenCoord, blockSize);                
                if (playerOnTile) {
                    if (playerOnTile.head.coords.x == x && playerOnTile.head.coords.y == y) 
                        this.setTextFor(playerOnTile, screenCoord);                    

                     this.addSprite('block', screenCoord, blockSize);
                }
                if (foodOnTile) this.addSprite('food', screenCoord, blockSize);
            }
        }        
    }

    setTextFor(player, screenCoord) {
        let text = this.userIdToText.get(player.userId);
        if (!text) {            
            text = new Text(player.name, {
                font: "12px Roboto", // Set  style, size and font
                fill: '#00ff00', // Set fill color to green
                align: 'center', // Center align the text, since it's multiline                
            });
           
            this.userIdToText.set(player.userId, text);
            
            this.textLayer.addChild(text);
        }

        text.x = screenCoord.x;
        text.y = screenCoord.y - 35;
    }

    addSprite(name, screenCoord, blockSize) {
        const sprite = this.spritePool.get(name);
        sprite.x = screenCoord.x;
        sprite.y = screenCoord.y;

        if ( sprite.scale.x == 1 && sprite.scale.y == 1)
        {
            const scale = blockSize / sprite.width;
            sprite.scale.set(scale, scale);
        }
        
        this.playerLayer.addChild(sprite);
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

    hideDeadPlayerText(players) {
        players.forEach(p => {
            const text = this.userIdToText.get(p.userId);
            this.textLayer.removeChild(text);
            text.destroy(true);
        });
    }
}
