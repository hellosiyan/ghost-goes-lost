import Drawable from '../lib/Drawable';
import game from '../Game';

export default class ChildGhost extends Drawable {
    constructor() {
        super();

        this.width = game.config.size.me;
        this.height = Math.ceil(game.config.size.me / 20 * 26);

        this.levitationTimeInterval = 0;

        this.direction = {
            x: '', // (left|right)
            y: '', // (up|down)
        };
    }

    draw(ctx) {
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        const spriteName = this.direction.y == 'up' ? 'back' : 'front';

        this.levitationTimeInterval = (this.levitationTimeInterval + game.loop.dt) % 2;
        const levitationHeightRatio = Math.abs(this.levitationTimeInterval - 1) * 0.2;
        const levitationY = Math.round(levitationHeightRatio * this.height);

        let x = this.x;
        let y = this.y - this.height - levitationY;

        if (this.direction.x == 'right') {
            ctx.scale(-1, 1);
            x = -1 * this.x - this.width;
        }

        game.spritesheets.ghost.draw(spriteName, ctx, x, y, this.width, this.height);
    }
}
