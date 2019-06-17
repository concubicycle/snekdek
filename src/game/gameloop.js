import Grid from './Grid';
import Window from './Window';
import GameSound from './GameSound'

import { Application } from 'pixi.js';

export default class GameLoop {
    constructor(sprites, onPlayerDied) {
        this.app = new Application({
            autoResize: true,
        });

        this.onPlayerDied = onPlayerDied;

        this.sprites = sprites;

        this.grid = new Grid(this.app, sprites);
        this.window = new Window(this.app);
    }

    lastLocalUser = null;
    active = true;

    refresh(state, localUser) {
        if (this.hasPlayerDied(localUser)) {            
            //this.teardown();
            if (this.onPlayerDied) this.onPlayerDied();
        }
        else if (this.active)
        {
            this.grid.redraw(state, localUser);
        }

        if (this.hasPlayerGrown(localUser)) {
            GameSound.score.play();
        }

        this.lastLocalUser = localUser;
    }

    hasPlayerDied(newUserState) {
        if (this.lastLocalUser != null && newUserState != null) {
            if (this.lastLocalUser.state == 1 && newUserState.state == 0) {
                return true;
            }
        }
        return false;
    }

    hasPlayerGrown(newUserState) {
        if (this.lastLocalUser != null && newUserState != null) {
            return this.lastLocalUser.score < newUserState.score;
        }
        return false;
    }

    teardown() {
        this.app.stage.destroy(true);
        this.app.stop();
        this.app.destroy(true);
        this.active = false;
    }
}