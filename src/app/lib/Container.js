import Rect from './Rect'

export default class Container extends Rect {
    constructor() {
        super()

        this.children = [];
    }

    addChild (child) {
        if (Array.isArray(child)) {
            child.forEach(element => this.addChild(element));
            return;
        }

        if(this.children.includes(child)) return;

        child.parent = this;
        this.children.push(child);
    }

    removeChild (child) {
        if (! this.children.includes(child)) return false;

        this.children.splice(index, 1);

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

        this.children.forEach(child => {
            ctx.save();
            child.draw(ctx);
            ctx.restore();
        })

        ctx.restore();
    }
}
