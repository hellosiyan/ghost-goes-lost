import Drawable from './lib/Drawable';
import Color from './lib/Color';
import Collidable from './Collidable';
import { config } from './config';

export default class Aisle extends Collidable(Drawable) {
    constructor() {
        super();

        this.graphic = new Drawable();
    }

    draw (ctx) {
        ctx.translate(this.x, this.y + this.height - this.graphic.height);

        this.graphic.draw(ctx);

        return this;
    }

    assemble() {
        const aisle = this;

        this.graphic.set({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height + config.size.aisleHeight / 2,
            draw: function (ctx) {
                const color = Color.fromHex(config.palette.base2);

                // Front Section (Base)
                ctx.fillStyle = color.toString();
                ctx.fillRect(this.x, this.y + config.size.aisleHeight / 2, aisle.width, aisle.height);

                // Top
                ctx.fillStyle = color.copy().darken(0.2).toString();
                ctx.fillRect(this.x, this.y, aisle.width, aisle.height - config.size.aisleHeight / 2);

                return this;
            },
        });

        this.graphic.cache();

        return this;
    }
}
