import SettableObject from './SettableObject'
import Style from './Style'
import Canvas from './Canvas'

export default class Drawable extends SettableObject {
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

    cache() {
        let offscreenCanvas = new Canvas();
        offscreenCanvas.setSize(this.width, this.height, false);

        this.draw(offscreenCanvas.ctx)

        this.draw = function (ctx) {
            ctx.drawImage(offscreenCanvas.node, this.x, this.y);
        }
    }

    positionAtAncestor(ancestor) {
        let parent = this.parent;
        let position = {
            x: this.x,
            y: this.y
        }

        while (parent !== null && ancestor !== parent) {
            position.x += parent.x;
            position.y += parent.y;

            parent = parent.parent;
        }

        return position;
    }

    distanceTo(target) {
        let thisCenter = this.center;
        let targetCenter = target.center;

        const distanceX = thisCenter.x - targetCenter.x;
        const distanceY = thisCenter.y - targetCenter.y;
        return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    }

    get center() {
        return {
            x: this.x + this.width/2,
            y: this.y + this.height/2,
        }
    }
}
