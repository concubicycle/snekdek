import { Application, Loader, Sprite } from 'pixi.js';

export default class SnekdekApplication {
    constructor() {
        this.application = new Application({
            autoResize: true,
            
        });       

        this.application.renderer.view.style.position = "absolute";
        this.application.renderer.view.style.display = "block";
        this.application.renderer.autoResize = true;
        this.application.renderer.resize(window.innerWidth, window.innerHeight);
        
        // The application will create a canvas element for you that you
        // can then insert into the DOM.
        document.body.appendChild(this.application.view);

        //window.addEventListener('resize', this.resize);
    }

    resize = () => {
        const parent = this.application.view.parentNode;
        this.application.renderer.resize(window.innerWidth-1, window.innerHeight-1);
    }
}

