import Drawable from '../lib/Drawable';
import Pixmap from '../lib/Pixmap';
import game from '../Game';
import { config } from '../config';

let colorKey = {
    '0': 'rgba(0,0,0,0)',
    '.': '#fff',
    '+': '#666',
    '-': '#eee',
    '=': '#ccc',
};

const pixmaps = {
    front: Pixmap.load(`
000000+++++++0000000
00000+.......+000000
000++..........++000
00+..............+00
0+................+0
0+................+0
+.................-+
+....++-..++-.....-+
+....+++..+++.....-+
+.................-+
+.................-+
+.....++++++......-+
+-......---......-=+
0+...............-+0
0+...............-+0
0+...............-+0
+...+.........+..-+0
+..-+.......+..-+-+0
+--+........+---+-+0
0+++-.......+++.-+00
00+--..........--+00
00+--.........--+000
00+............-+000
0+=...........-+0000
0+-..........-+00000
+=..........-+000000
+-..........+0000000
+=-........-+0000000
0+=-........=+000000
00+==---....-=+00000
000++===------+00000
00000++++======+0000
000000000++++++00000`, colorKey).toDrawable({ fitWidth: config.size.mom }).cache(),
};

export default class MotherGhost extends Drawable {
    constructor() {
        super();

        this.width = game.config.size.mom;
        this.height = pixmaps.front.height;

        this.levitationTimeInterval = 1;
    }

    draw(ctx) {
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        const spriteName = 'front';

        this.levitationTimeInterval = (this.levitationTimeInterval + game.loop.dt) % 2;
        const levitationHeightRatio = Math.abs(this.levitationTimeInterval - 1) * 0.2;
        const levitationY = Math.round(levitationHeightRatio * this.height);

        let x = this.x;
        let y = this.y - this.height - levitationY;

        let drawable = pixmaps[spriteName];
        drawable.x = x;
        drawable.y = y;
        drawable.draw(game.canvas.ctx);
    }
}
