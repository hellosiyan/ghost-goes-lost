import BaseObject from './BaseObject'

export default class Color extends BaseObject {

    constructor() {
        super()

        this.h = 0;
        this.s = 0;
        this.l = 0;
        this.a = 1;
    }

    toString() {
        return 'hsla('+this.h+','+this.s+'%,'+this.l+'%,'+this.a+')';
    }

    lighten(percent) {
        this.l = Math.min(100, this.l + this.l * percent)
        return this
    }

    darken(percent) {
        this.l = Math.max(0, this.l - this.l * percent)
        return this
    }

    setH(h){
        this.h = Math.min(255, Math.max(0, h))
        return this
    }

    setS(s){
        this.s = Math.min(100, Math.max(0, s))
        return this
    }

    setL(l){
        this.l = Math.min(100, Math.max(0, l))
        return this
    }

    copy() {
        let copy = new Color()
        copy.set({
            h: this.h,
            s: this.s,
            l: this.l,
            a: this.a
        })

        return copy;
    }

    static hsla(h, s, l, a) {
        let color = new Color();

        color.set({h, s, l, a})

        return color;
    }

    static fromHex(hex) {
        let regexp = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
        let bits = hex.match(regexp)

        let r = parseInt(bits[ 1 ], 16)
        let b = parseInt(bits[ 2 ], 16)
        let g = parseInt(bits[ 3 ], 16)

        return Color.fromRGB(r, g, b)
    }

    static fromRGB(r, g, b) {
        let color = new Color();

        color.setRGB(r,g,b)

        return color;
    }

    setRGB(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        this.h = parseInt((h*360).toFixed(0), 10);
        this.s = parseInt((s*100).toFixed(6), 10);
        this.l = parseInt((l*100).toFixed(6), 10);
    }

    toRGB() {
        let r = 0, g = 0, b = 0;

        if (s == 0) {
            r = g = b = this.l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = this.l < 0.5 ? this.l * (1 + this.s) : this.l + this.s - this.l * this.s;
            var p = 2 * this.l - q;

            r = hue2rgb(p, q, this.h + 1/3);
            g = hue2rgb(p, q, this.h);
            b = hue2rgb(p, q, this.h - 1/3);
        }

        return [ r * 255, g * 255, b * 255 ];
    }
}
