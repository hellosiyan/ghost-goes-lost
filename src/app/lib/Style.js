import SettableObject from './SettableObject';

export default class Style extends SettableObject {
    constructor () {
        super();

        this.color = '#999';
        this.radius = 3;
        this.opacity = 1;

        this.lineColor = '#999';
        this.lineWidth = 0;
    }
}
