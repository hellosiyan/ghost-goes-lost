import BaseObject from './BaseObject'

export default class Sprite extends BaseObject {
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
        Object.keys(areaDefs).forEach(name => {
            let a = areaDefs[name]
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');

            c.width = a.w;
            c.height = a.h;

            ctx.drawImage(this.img, a.x,a.y,a.w,a.h,0,0,a.w,a.h)

            this.areas[name] = {
                width: a.w,
                height: a.h,
                canvas: c
            }
        })
    }

    get(areaName) {
        return this.areas[areaName];
    }

    drawToHeight(area, ctx, x, y, dHeight) {
        let a = this.areas[area];
        let dWidth = dHeight / a.height * a.width

        this.draw(area, ctx, x, y, dWidth, dHeight)
    }

    drawToFit(area, ctx, x, y, dWidth, dHeight) {
        let a = this.areas[area];
        let w = dWidth
        let h = w / a.width * a.height

        if ( h > dHeight ) {
            h = dHeight
            w = h / a.height * a.width
        }

        this.draw(area, ctx, x, y, w, h)
    }

    draw(area, ctx, x, y, dWidth, dHeight) {
        let a = this.areas[area];

        if ( ! a ) {
            return
        }

        ctx.drawImage(
            a.canvas,
            0,
            0,
            a.width,
            a.height,
            x,
            y,
            dWidth,
            dHeight
        )
    }
}
