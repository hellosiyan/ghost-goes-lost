import Rectangle from '../lib/Rectangle';
import Pixmap from '../Pixmap';
import { inGridTiles } from '../utils';

let colorKey = {
    0: '#000',
    3: '#0A0507',
    6: '#1D1833',
    9: '#463E60',
    a: '#585072',
    c: '#6A628E',
    f: '#9084BC',
};

const pixmaps = {
    left: Pixmap.load(`
3699999a3`, colorKey),
    right: Pixmap.load(`
3a9999963`, colorKey),
    leftTop: Pixmap.load(`
333333333
366666666
369999999
3699999aa
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3
3699999a3`, colorKey),
    rightTop: Pixmap.load(`
333333333
666666663
999999963
aa9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963
3a9999963`, colorKey),
    leftBottom: Pixmap.load(`
3699999a3
3699999aa
369999999
369999999
366666666
333333333`, colorKey),
    rightBottom: Pixmap.load(`
3a9999963
aa9999963
999999963
999999963
666666663
333333333`, colorKey),
};

export default class Corner extends Rectangle {
    constructor() {
        super();

        this.setType('leftTop'); // (leftTop|rightTop|leftBottom|rightBottom)

        this.width = inGridTiles(1);
        this.height = inGridTiles(1);

        this.graphic = {
            x: 0,
            y: 0,
            canvas: false,
        };
    }

    setType(type) {
        this.type = type;

        return this;
    }

    getRenderSize() {
        return pixmaps[this.type].getRenderSize();
    }

    placeAt(point) {
        switch (this.type) {
            case 'leftTop':
                this.x = point.x - this.width;
                this.y = point.y - this.height;
                break;
            case 'rightTop':
                this.x = point.x;
                this.y = point.y - this.height;
                break;
            case 'leftBottom':
                this.x = point.x - this.width;
                this.y = point.y;
                break;
            case 'rightBottom':
                this.x = point.x;
                this.y = point.y;
                break;
        }

        return this;
    }

    draw(ctx) {
        ctx.drawImage(
            this.graphic.canvas.node,
            this.x + this.graphic.x,
            this.y + this.graphic.y
        );
    }

    assemble() {
        const drawable = pixmaps[this.type].toDrawable();

        this.graphic.canvas = drawable.asCanvas();

        // Align drawable to bottom
        if (this.type.toLowerCase().includes('top')) {
            this.graphic.y += this.height - drawable.height;
        }

        // Align drawable to right
        if (this.type.toLowerCase().includes('left')) {
            this.graphic.x += this.width - drawable.width;
        }

        return this;
    }
}
