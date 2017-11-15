import SettableObject from './lib/SettableObject'
import TileGrid from './lib/TileGrid'
import game from './Game'

export default class Section extends SettableObject {
    constructor() {
        super()

        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.color = '#dad'
    }

    get area() {
        return this.w * this.h
    }

    get xMax () {
        return this.x + this.w
    }

    get yMax () {
        return this.y + this.h
    }

    getTileGrid () {
        if ( this.hasOwnProperty('tileGrid') ) {
            return this.tileGrid;
        }

        this.tileGrid = new TileGrid()
        this.tileGrid.resize(this.w, this.h)

        let vertical = this.w > this.h
        let padding = Math.round(game.prngs.pcg.next())
        let step = Math.round(game.prngs.pcg.next()) + 2

        // Remove random padding for odd lengths
        if ( vertical && ((this.w%2) == 1) ) {
            padding = 0;
        } else if ( ! vertical && ((this.h%2) == 1) ) {
            padding = 0;
        }

        for (let x = this.x; x < this.xMax; x++) {
            for (let y = this.y; y < this.yMax; y++) {
                let draw = vertical ? (this.xMax - x + padding) % step: (this.yMax - y + padding) % step;

                if (draw) {
                    this.tileGrid.set(x - this.x, y - this.y, 1)
                }
            }
        }

        return this.tileGrid
    }

    divide () {
        if ( this.area < 24 ) return false;

        let props = this.w > this.h ? ['x', 'w']: ['y', 'h'];
        let cut = Math.round(this[props[1]] * (0.5 + (game.prngs.pcg.next()-0.5) * 0.2))

        let sibling = new Section().set({
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        })

        sibling.color = game.prngs.pcg.color();
        sibling[props[0]] += cut
        sibling[props[1]] -= cut

        this[props[1]] = cut - 1;

        return sibling
    }
}
