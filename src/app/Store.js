import Obstacle from './Obstacle'
import BaseObject from './BaseObject'
import Tiles from './Tiles'
import game from './Game'

export default class Store {
    constructor() {
        this.aisles = []
        this.difficulty = 2
        this.width = 0
        this.height = 0
        this.tiles = new Tiles()
    }

    generateMap () {
        this.width = 5 + this.difficulty * 2
        this.height = 5 + this.difficulty * 2

        this.tiles.resize(this.width, this.height)

        let sections = this.generateSections()

        sections.forEach((section, sectionKey) =>
            this.tiles.overlayWith(
                section.getTiles(), section.x, section.y, sectionKey
            )
        )

        console.log('Tiles:\n', this.tiles.toString())

        return {aisles: []}
    }

    generateSections () {
        let sections = [];
        sections[1] = new Section().set({
            x: 1, y: 1,
            w: this.width - 2,
            h: this.height - 2,
            color: game.prngs.pcg.color()
        })

        let hasNewSections = true

        while (hasNewSections) {
            hasNewSections = false
            for (var i = 1; i < sections.length; i++) {
                let newSection = sections[i].divide()

                if (!newSection) continue;

                hasNewSections = true
                sections.push(newSection)
            }
        }

        return sections
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

    get area() {
        return this.w * this.h
    }

    get xMax () {
        return this.x + this.w
    }

    get yMax () {
        return this.y + this.h
    }

    getAisles () {
        if ( this.hasOwnProperty('aisles') ) {
            return this.aisles;
        }

        this.aisles = []

        let tiles = this.getTiles()

        tiles.each((x, y, tile) => {
            if (tile) {
                this.aisles.push(this.createAisle(this.x + x, this.y + y))
            }
        })

        return this.aisles
    }

    getTiles () {
        if ( this.hasOwnProperty('tiles') ) {
            return this.tiles;
        }

        this.tiles = new Tiles()
        this.tiles.resize(this.w, this.h)

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
                    this.tiles.set(x - this.x, y - this.y, 1)
                }
            }
        }

        return this.tiles
    }

    createAisle(x, y) {
        let aisle = new Obstacle().set({
            width: game.config.size.grid * 1,
            height: game.config.size.grid * 1,
            x: game.config.size.grid * x,
            y: game.config.size.grid * y
        });
        aisle.style.color = this.color
        aisle.style.opacity = 0.9

        return aisle
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
