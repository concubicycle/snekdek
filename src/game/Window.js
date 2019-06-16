export default class SnekdekApplication {
    constructor(app) {
        this.app = app;            

        this.app.renderer.view.style.position = "absolute";
        this.app.renderer.view.style.display = "block";
        this.app.renderer.autoResize = true;
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        
        // The application will create a canvas element for you that you
        // can then insert into the DOM.
        const gameEl = document.getElementById('game');
        gameEl.appendChild(this.app.view);
    }

    resize = () => {        
        this.app.renderer.resize(window.innerWidth-1, window.innerHeight-1);
    }
}

