import Drawable from './lib/Drawable';
import Color from './lib/Color';
import Collidable from './Collidable';
import { config } from './config';

export default class Aisle extends Collidable(Drawable) {
    draw (ctx) {
        const color = Color.fromHex(config.palette.base2);

        // Front Section (Base)
        ctx.fillStyle = color.toString();
        ctx.globalAlpha = 1;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Top
        ctx.fillStyle = color.copy().darken(0.2).toString();
        ctx.globalAlpha = 1;
        ctx.fillRect(this.x, this.y - config.size.aisleHeight / 2, this.width, this.height - config.size.aisleHeight / 2);

        return this;
    }
}
