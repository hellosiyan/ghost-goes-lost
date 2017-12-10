import SettableObject from './SettableObject';
import Drawable from './Drawable';

export default class Pixmap extends SettableObject {
    constructor() {
        super();

        this.width = 0;
        this.height = 0;
        this.map = [];
    }

    toDrawable(options) {
        let pixelSize = 1;

        if (typeof options['fitWidth'] !== 'undefined') {
            pixelSize = Math.floor(options.fitWidth / this.width);
        }

        let width = this.width * pixelSize;
        let height = this.height * pixelSize;

        let drawable = new Drawable().set({ width, height });

        drawable.draw = (ctx) => {
            this.map.forEach((color, index) => {
                ctx.fillStyle = color;
                ctx.fillRect(
                    drawable.x + Math.floor(index % this.width) * pixelSize,
                    drawable.y + Math.floor(index / this.width) * pixelSize,
                    pixelSize,
                    pixelSize
                );
            });
        };

        return drawable;
    }

    static load(literal, colorKey, width = 0) {
        const colors = [];

        literal = literal.trim();

        if (width === 0) {
            let firstNewlinePosition = literal.indexOf('\n');
            width = firstNewlinePosition > 0 ? firstNewlinePosition : literal.length;
        }

        for (let char of literal) {
            if (char === '\n') {
                continue;
            }

            if (! colorKey.hasOwnProperty(char)) {
                console.warn(`Key "${char}" not defined in the color list.`);
                colorKey[char] = '#0f0';
            }

            colors.push(colorKey[char]);
        }

        return new Pixmap().set({
            map: colors,
            width: width,
            height: Math.ceil(colors.length / width),
        });
    }
}
