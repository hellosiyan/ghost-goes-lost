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

    addTo (...containers) {
        containers.forEach(container => container.addChild(this));
    }

    setStyle(styles) {
        this.style.set(styles)
        return this
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
    }

    removeChild (child) {
        var ind = this.children.indexOf(child);
        if (ind < 0) return false;
        this.children.splice(ind, 1);
        return true;
    }

    draw (ctx) {
        super.draw(ctx);
        this.drawChildren(ctx);
    }

    drawChildren(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        for (let i = this.children.length - 1; i >= 0; i--) {
            ctx.save();
            this.children[i].draw(ctx)
            ctx.restore();
        }

        ctx.restore();
    }
}
