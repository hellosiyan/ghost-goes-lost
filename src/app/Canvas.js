export default class Canvas {
    constructor() {
        this.width = 640;
        this.height = 480;
        this.autoClear = true;
        this.scene = null;

        this.node = this._createCanvas();
        this.ctx = this.node.getContext('2d');
    }

    appendTo(container) {
        container.appendChild(this.node);
    }

    setScene (scene) {
        this.scene = scene;

        return this;
    }

    draw () {
        if( this.autoClear ) this.clear();

        this.scene.children.forEach(child => {
            if (child && child.visible) {
                this.ctx.save();
                child.draw(this.ctx);
                this.ctx.restore();
            }
        })
    }

    clear () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    _createCanvas() {
        let canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        return canvas;
    }
}
