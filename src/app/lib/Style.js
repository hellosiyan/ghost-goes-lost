import BaseObject from './BaseObject'

export default class Style extends BaseObject {
    constructor () {
        super()

        this.color = '#999';
        this.radius = 3;
        this.opacity = 1;

        this.lineColor = '#999';
        this.lineWidth = 0;
    }
}
