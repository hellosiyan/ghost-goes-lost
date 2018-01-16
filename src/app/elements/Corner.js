import Rectangle from '../lib/Rectangle';
import Collidable from '../Collidable';
import Pixmap from '../Pixmap';

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

export default class Corner extends Collidable(Rectangle) {
    constructor() {
        super();

        this.setType('leftTop'); // (leftTop|rightTop|leftBottom|rightBottom)
    }

    setType(type) {
        this.type = type;

        const renderSize = this.getRenderSize();

        this.width = renderSize.width;
        this.height = renderSize.height;

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
        ctx.fillStyle = '#f00';
        ctx.globalAlpha = 0.2;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
    }

    draw(ctx) {
        pixmaps[this.type]
            .toDrawable()
            .set({
                x: this.x,
                y: this.y,
            })
            .draw(ctx);
    }
}
