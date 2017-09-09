import BaseObject from './BaseObject'

export {Style, Drawable, Circle, Rect, Container};

class Style extends BaseObject {
    constructor () {
        super()

        this.color = '#999';
        this.radius = 3;
        this.opacity = 1;

        this.lineColor = '#999';
        this.lineWidth = 0;
    }
}

class Drawable extends BaseObject {
    constructor() {
        super()

        this.x = 0;
        this.y = 0;
        this.width = 1;
        this.height = 1;
        this.visible = true;
        this.style = new Style();
        this.parent = null
    }

    draw(){}

    intersects (target) {
        if (this.x < target.x + target.width &&
            this.x + this.width > target.x &&
            this.y < target.y + target.height &&
            this.height + this.y > target.y
        ) {
            return true;
        }

        return false;
    }

    collisionResponseImpulse (target) {
        let impulse = {
            x: 0,
            y: 0
        }

        if ( this.y > target.y ) {
            impulse.y = target.y + target.height - this.y
        } else {
            impulse.y = -1*(this.y + this.height - target.y)
        }

        if ( this.x > target.x ) {
            impulse.x = target.x + target.width - this.x
        } else {
            impulse.x = -1*(this.x + this.width - target.x)
        }

        if (Math.abs(impulse.x) > Math.abs(impulse.y)) {
            impulse.x = 0
        } else {
            impulse.y = 0
        }

        return impulse;
    }

    addTo (container) {
        container.addChild(this);
    }

    setStyle(styles) {
        this.style.set(styles)
        return this
    }

    getImageData() {
        var offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = this.width;
        offscreenCanvas.height = this.height;

        var ctx = offscreenCanvas.getContext('2d');

        this.draw(ctx)

        let imageData = ctx.getImageData(0,0,this.width,this.height);

        return imageData;
    }

    cache() {
        let imageData = this.getImageData();

        this.draw = function (ctx) {
            ctx.putImageData(
                imageData,
                this.parent.x, this.parent.y
            )
        }
    }

    get absX() {
        return this.x + (this.parent?this.parent.absX:0)
    }

    get absY() {
        return this.y + (this.parent?this.parent.absY:0)
    }
}

class Circle extends Drawable {
    draw (ctx) {
        ctx.fillStyle = this.style.color;
        ctx.globalAlpha = this.style.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.style.radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        return this;
    }
}

class Rect extends Drawable{
    draw (ctx) {
        ctx.fillStyle = this.style.color;
        ctx.globalAlpha = this.style.opacity;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if ( this.style.lineWidth ) {
            ctx.lineWidth = this.style.lineWidth
            ctx.strokeStyle = this.style.lineColor
            ctx.strokeRect(this.x, this.y, this.width, this.height)
        }

        return this;
    }
}

class Container extends Rect {
    constructor() {
        super()

        this.children = [];
    }

    addChild (child) {
        if(this.children.indexOf(child) >= 0) return;

        this.children.push(child);
        child.parent = this;
    }

    removeChild (child) {
        var ind = this.children.indexOf(child);
        if (ind < 0) return false;
        this.children.splice(ind, 1);
        return true;
    }

    draw (ctx) {
        if (this.visible) {
            super.draw(ctx);
        }

        this.drawChildren(ctx);
    }

    drawChildren(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        for (let i = 0; i < this.children.length; i++) {
            ctx.save();
            this.children[i].draw(ctx)
            ctx.restore();
        }

        ctx.restore();
    }
}
