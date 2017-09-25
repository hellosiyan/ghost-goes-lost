import Rect from './Rect'

export default class Container extends Rect {
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
