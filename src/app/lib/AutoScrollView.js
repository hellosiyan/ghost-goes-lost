import Container from './Container';

export default class AutoScrollView extends Container {
    constructor() {
        super();

        this.target = null;
        this.boundries = {
            left: 0,
            right: 1,
            top: 0,
            bottom: 1,
        };
    }

    addChild (child) {
        super.addChild(child);

        if (this.children.length > 1) {
            throw 'AutoScrollView cannot have more than one child';
        }
    }

    draw (ctx) {
        this.moveTargetIntoView();

        return super.draw(ctx);
    }

    moveTargetIntoView() {
        let coords = this.target.positionAtAncestor(this);

        if (coords.x < this.boundries.left) {
            this.children[0].x += this.boundries.left - coords.x;
        } else if (coords.x > this.boundries.right) {
            this.children[0].x -= coords.x - this.boundries.right;
        }

        if (coords.y < this.boundries.top) {
            this.children[0].y += this.boundries.top - coords.y;
        } else if (coords.y > this.boundries.bottom) {
            this.children[0].y -= coords.y - this.boundries.bottom;
        }
    }
}
