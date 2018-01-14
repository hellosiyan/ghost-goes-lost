import Rectangle from '../lib/Rectangle';
import Collidable from '../Collidable';
import Pixmap from '../lib/Pixmap';
import game from '../Game';


let colorKey = {
    '0': '#000',//'#000',//'#000',
    '3': '#0A0507',//'#2B1B07',//'#333',
    '6': '#1D1833',//'#593A1B',//'#666',
    '9': '#463E60',//'#875F33',//'#999',
    'a': '#585072',//'#B47948',//'#ccc',
    'c': '#6A628E',//'#B47948',//'#ccc',
    'f': '#9084BC',//'#E29B5D',//'#fff',
};

const pixmaps = {
    top: Pixmap.load(`
33333333333333
66666666666666
99999999999999
aaaaaaaaaaaaaa
33333333333333
3c99999999999c
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fcccccccccccf
3fffffffffffff
33333333333333
36666666666666
3aaaaaaaaaaaaa
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
3caaaaaaaaaaac
33333333333333
99999999999999
99999999999999
66666666666666
33333333333333`, colorKey),
    left: Pixmap.load(`
3699999a3`, colorKey),
    right: Pixmap.load(`
3a9999963`, colorKey),
    bottom: Pixmap.load(`
3
a
9
9
6
3`, colorKey)
};

export default class Wall extends Collidable(Rectangle) {
    constructor() {
        super();

        this.setType('top'); // (top|bottom|left|right)
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
        switch( this.type ) {
            case 'top':
                this.x = point.x;
                this.y = point.y - this.getRenderSize().height;
                break;
            case 'bottom':
                this.x = point.x;
                this.y = point.y;
                break;
            case 'left':
                this.x = point.x - this.getRenderSize().width;
                this.y = point.y;
                break;
            case 'right':
                this.x = point.x;
                this.y = point.y;
                break;
        }

        return this;
    }

    resizeTo(size) {
        switch( this.type ) {
            case 'top':
            case 'bottom':
                this.width = Math.abs(size);
                if (size < 0) this.x += size;
                break;
            case 'left':
            case 'right':
                this.height = Math.abs(size);
                if (size < 0) this.y += size;
                break;
        }

        return this;
    }


    draw(ctx) {
        switch(this.type) {
            case 'top':
            case 'bottom':
                pixmaps[this.type]
                    .toPatternedDrawable({ width: this.width }, 'repeat-x')
                    .set({
                        x: this.x,
                        y: this.y
                    })
                    .draw(ctx);
                break;
            case 'left':
            case 'right':
                pixmaps[this.type]
                    .toPatternedDrawable({ height: this.height }, 'repeat-y')
                    .set({
                        x: this.x,
                        y: this.y
                    })
                    .draw(ctx);
                break;
        }

        // ctx.fillStyle = '#0f0';
        // ctx.globalAlpha = 0.2;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        // ctx.globalAlpha = 1;
    }
}
