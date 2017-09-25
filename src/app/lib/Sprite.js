import SettableObject from './SettableObject'

export default class Sprite extends SettableObject {
    constructor() {
        super()

        this.img = false
        this.areas = {}
    }

    load(url, areaDefs) {
        this.img = new Image();
        this.img.addEventListener('load', () => this.process(areaDefs), false);
        this.img.src = url

        return this
    }

    process(areaDefs) {
        Object.keys(areaDefs).forEach(areaName => {
            let area = areaDefs[areaName]
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');

            canvas.width = area.w;
            canvas.height = area.h;

            ctx.drawImage(this.img, area.x,area.y,area.w,area.h,0,0,area.w,area.h)

            this.areas[areaName] = {
                width: area.w,
                height: area.h,
                canvas: canvas
            }
        })
    }

    get(areaName) {
        return this.areas[areaName];
    }

    drawToHeight(areaName, ctx, x, y, destHeight) {
        let area = this.areas[areaName];
        let destWidth = destHeight / area.height * area.width

        this.draw(areaName, ctx, x, y, destWidth, destHeight)
    }

    drawToFit(areaName, ctx, x, y, destWidth, destHeight) {
        let area = this.areas[areaName];
        let width = destWidth
        let height = width / area.width * area.height

        if ( height > destHeight ) {
            height = destHeight
            width = height / area.height * area.width
        }

        this.draw(areaName, ctx, x, y, width, height)
    }

    draw(areaName, ctx, x, y, destWidth, destHeight) {
        let area = this.areas[areaName];

        if ( ! area ) {
            return
        }

        ctx.drawImage(
            area.canvas,
            0,
            0,
            area.width,
            area.height,
            x,
            y,
            destWidth,
            destHeight
        )
    }
}
