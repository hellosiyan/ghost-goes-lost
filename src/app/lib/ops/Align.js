export default class Align {

    constructor(base, target) {
        this.base = base;
        this.target = target;
    }

    bottomEdges() {
        this.target.y = this.base.y + this.base.height - this.target.height;

        return this.target;
    }

    centerBottomEdge() {
        this.target.y = Math.round(this.base.y + this.base.height / 2 - this.target.height);

        return this.target;
    }

}
