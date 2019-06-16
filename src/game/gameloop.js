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
    }

    refresh(state, localUser) {        
        this.grid.redraw(state.users, localUser, state.allFood);
    }
}