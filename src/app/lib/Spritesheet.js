import SettableObject from './SettableObject';

export default class Spritesheet extends SettableObject {
    constructor() {
        super();

        this.sprites = {};
    }

    get(spriteName) {
        return this.sprites[spriteName];
    }

    drawToHeight(spriteName, ctx, x, y, destHeight) {
        let sprite = this.sprites[spriteName];
        let destWidth = destHeight / sprite.height * sprite.width;

        this.draw(spriteName, ctx, x, y, destWidth, destHeight);
    }

    drawToFit(spriteName, ctx, x, y, destWidth, destHeight) {
        let sprite = this.sprites[spriteName];
        let width = destWidth;
        let height = width / sprite.width * sprite.height;

        if (height > destHeight) {
            height = destHeight;
            width = height / sprite.height * sprite.width;
        }

        this.draw(spriteName, ctx, x, y, width, height);
    }

    draw(spriteName, ctx, x, y, destWidth, destHeight) {
        let sprite = this.sprites[spriteName];

        if (! sprite) {
            return;
        }

        ctx.drawImage(
            sprite.canvas,
            0,
            0,
            sprite.width,
            sprite.height,
            x,
            y,
            destWidth,
            destHeight
        );
    }
}