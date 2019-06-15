import Grid from './Grid';
import Window from './Window';

import { Application } from 'pixi.js';

export default class GameLoop {
    constructor(sprites) {
        this.app = new Application({
            autoResize: true,            
        });   

        this.sprites = sprites;

        this.grid = new Grid(this.app, sprites);
        this.window = new Window(this.app);

        const localPlayer = { head: { coords: {x: 2000, y: 1000} }};
        this.grid.redraw([], localPlayer);
    }
}