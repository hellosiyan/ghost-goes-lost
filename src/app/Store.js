import Obstacle from './Obstacle'
import BaseObject from './BaseObject'
import game from './Game'

export default class Store {
    constructor() {
        this.aisles = []
        this.difficulty = 1
    }

    generateMap () {
        let size = {
            x: 7 + this.difficulty * 2,
            y: 7 + this.difficulty * 2
        }

        let sections = [new Section().set({
            x: 1, y: 1,
            w: size.x-2, h: size.y-2,
            color: game.prngs.pcg.color()
        })];

        let hasNewSections = true

        while (hasNewSections) {
            hasNewSections = false
            for (var i = 0; i < sections.length; i++) {
                let newSection = sections[i].divide()

                if (!newSection) continue;

                hasNewSections = true
                sections.push(newSection)
            }
        }

        let aisles = []
        sections.forEach(section => aisles = aisles.concat(section.getAisles()))

        return {
            aisles: aisles,
            size: size
        }
    }
}

class Section extends BaseObject {
    constructor() {
        super()

        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.color = '#dad'
    }

    get size() {
        return this.w * this.h
    }

    get xMax () {
        return this.x + this.w
    }

    get yMax () {
        return this.y + this.h
    }

    getAisles () {
        this.aisles = []

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
                    this.aisles.push(this.createAisle(x, y))
                }
            }
        }

        return this.aisles
    }

    createAisle(x, y) {
        let aisle = new Obstacle().set({
            width: game.config.size.grid,
            height: game.config.size.grid,
            x: game.config.size.grid * x,
            y: game.config.size.grid * y
        });
        aisle.style.color = this.color
        aisle.style.opacity = 0.9

        return aisle
    }

    divide () {
        if ( this.size < 24 ) return false;

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
