import Obstacle from './Obstacle'
import BaseObject from './BaseObject'
import {Container} from './Drawables'
import Tiles from './Tiles'
import game from './Game'

export default class Store {
    constructor() {
        this.aisles = []
        this.difficulty = 4
        this.width = 0
        this.height = 0
        this.tiles = new Tiles()
        this.drawables = new Container()
    }

    placePeople() {
        let emptyTiles = this.tiles.filter(0)
        let playerTile = game.prngs.pcg.pick(emptyTiles)

        let possibleTiles = Tiles.outsideRadius(
            emptyTiles,
            playerTile,
            Math.round(Math.max(this.width, this.height)/1.5)
        );
        let momTile = game.prngs.pcg.pick(possibleTiles)

        game.player.x = playerTile.x * game.config.size.grid
        game.player.y = playerTile.y * game.config.size.grid
        game.mom.x = momTile.x * game.config.size.grid
        game.mom.y = momTile.y * game.config.size.grid
    }

    createDrawables() {
        this.constructTiles()
        this.createBorderDrawables()

        this.tiles.each((x, y, tile) => {
            if (!tile || tile == 99) return;

            let drawable = new Obstacle().set({
                x: x * game.config.size.grid,
                y: y * game.config.size.grid,
                width: 1 * game.config.size.grid,
                height: 1 * game.config.size.grid
            }).setStyle({
                color: this.sections[tile].color
            })

            this.drawables.addChild(drawable)
        })
    }

    createBorderDrawables() {
        // top
        this.drawables.addChild(new Obstacle().set({
            x: 0,
            y: 0,
            width: this.width * game.config.size.grid,
            height: 1 * game.config.size.grid
        }).setStyle({color: '#000'}))

        // bottom
        this.drawables.addChild(new Obstacle().set({
            x: 0,
            y: (this.height-1) * game.config.size.grid,
            width: this.width * game.config.size.grid,
            height: 1 * game.config.size.grid
        }).setStyle({color: '#000'}))

        // left
        this.drawables.addChild(new Obstacle().set({
            x: 0,
            y: 1 * game.config.size.grid,
            width: 1 * game.config.size.grid,
            height: (this.height-2) * game.config.size.grid
        }).setStyle({color: '#000'}))

        // right
        this.drawables.addChild(new Obstacle().set({
            x: (this.width-1) * game.config.size.grid,
            y: 1 * game.config.size.grid,
            width: 1 * game.config.size.grid,
            height: (this.height-2) * game.config.size.grid
        }).setStyle({color: '#000'}))
    }

    constructTiles () {
        this.width = 5 + this.difficulty * 2
        this.height = 5 + this.difficulty * 2

        this.tiles.resize(this.width, this.height)
        this.tiles.fillRow(0, 99)
        this.tiles.fillRow(this.width-1, 99)
        this.tiles.fillCol(0, 99)
        this.tiles.fillCol(this.height-1, 99)

        this.generateSections()

        this.sections.forEach((section, sectionKey) =>
            this.tiles.overlayWith(
                section.getTiles(), section.x, section.y, sectionKey
            )
        )
    }

    generateSections () {
        this.sections = [];
        this.sections[1] = new Section().set({
            x: 2, y: 2,
            w: this.width - 4,
            h: this.height - 4,
            color: game.prngs.pcg.color()
        })

        let hasNewSections = true

        while (hasNewSections) {
            hasNewSections = false
            for (var i = 1; i < this.sections.length; i++) {
                let newSection = this.sections[i].divide()

                if (!newSection) continue;

                hasNewSections = true
                this.sections.push(newSection)
            }
        }

        return this.sections
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
