import Drawable from '../lib/Drawable';
import Pixmap from '../lib/Pixmap';

let colorKey = {
    '0': '#132339',
    '1': '#162c44',
    '2': '#17314a',
};

const pixmap = Pixmap.load(`
000000000000002
011111111111112
011111111111112
011111111111112
011111111111112
011111111111112
011111111111112
011111111111112
011111111111112
011111111111112
011111111111112
011111111111112
011111111111112
011111111111112
222222222222222`, colorKey);

export default class TileFloor extends Drawable {
    draw(ctx) {
        pixmap
            .toPatternedDrawable({ height: this.height, width: this.width }, 'repeat')
            .set({
                x: this.x,
                y: this.y
            })
            .draw(ctx);
    }
}
