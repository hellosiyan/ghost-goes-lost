import Obstacle from './Obstacle'
import Shelf from './Shelf'
import BaseObject from './BaseObject'
import {Drawable, Container} from './Drawables'
import Tiles from './Tiles'
import Color from './Color'
import game from './Game'

export default class Store {
    constructor(difficulty) {
        this.difficulty = difficulty
        this.width = 5 + this.difficulty * 2
        this.height = 5 + this.difficulty * 2

        this.tiles = new Tiles()
        this.drawable = new Container().set({
            width: this.width * game.config.size.grid,
            height: this.height * game.config.size.grid,
            visible: false
        })

        this.generateSections()
        this.constructTiles()
        this.createDrawables()
    }

    placePeople(player, mom) {
        let emptyTiles = this.tiles.filter(0)
        let playerTile = game.prngs.pcg.pick(emptyTiles)

        let possibleTiles = Tiles.outsideRadius(
            emptyTiles,
            playerTile,
            Math.round(Math.max(this.width-2, this.height-2)/1.5)
        );
        let momTile = game.prngs.pcg.pick(possibleTiles)

        player.x = playerTile.x * game.config.size.grid
        player.y = playerTile.y * game.config.size.grid
        mom.x = momTile.x * game.config.size.grid
        mom.y = momTile.y * game.config.size.grid
    }

    createDrawables() {
        this.createFloorDrawable()
        this.createBorderDrawables()

        this.tiles.each((x, y, tile) => {
            if (!tile || tile == 99) return;

            let extensions = {
                right: 1,
                bottom: 1
            }

            while(this.tiles.get(x+extensions.right, y)) {
                extensions.right++;
            }

            while(this.tiles.get(x, y+extensions.bottom)) {
                extensions.bottom++;
            }

            this.tiles.fill(x, y, x+extensions.right, y+extensions.bottom, 99)
            this.tiles.set(x, y, tile)

            let drawable = new Shelf().set({
                x: x * game.config.size.grid,
                y: y * game.config.size.grid,
                width: (1+extensions.right-1) * game.config.size.grid,
                height: (1+extensions.bottom-1) * game.config.size.grid
            }).setStyle({
                color: this.sections[tile].color
            })

            this.drawable.addChild(drawable)
        })

        this.drawable.cache()
    }

    createFloorDrawable() {
        let color = Color.fromHex(game.config.palette.base1).darken(0.2)

        let w = Math.round(game.config.size.grid / 4)
        let h = Math.round(game.config.size.grid / 4)
        let pad = 1
        let offscreenCanvas = document.createElement('canvas');
        let octx = offscreenCanvas.getContext('2d');

        offscreenCanvas.width = w;
        offscreenCanvas.height = h;

        octx.fillStyle = color.copy().lighten(0.1).toString()
        octx.fillRect(0,0,w,h);
        octx.fillStyle = color.copy().darken(0.25).toString()
        octx.fillRect(pad,pad,w,h);
        octx.fillStyle = color.copy().toString()
        octx.fillRect(pad*2,pad*2,w-pad*2,h-pad*2);

        let drawable = (new Drawable).set({
            x: 0,
            y: 0,
            width: this.width * game.config.size.grid,
            height: this.height * game.config.size.grid
        });

        drawable.draw = (ctx) => {
            ctx.fillStyle = ctx.createPattern(offscreenCanvas, 'repeat');
            ctx.globalAlpha = drawable.style.opacity;
            ctx.fillRect(drawable.x, drawable.y, drawable.width, drawable.height);
        }

        this.drawable.addChild(drawable)

        return drawable
    }

    createBorderDrawables() {
        let color = Color.fromHex(game.config.palette.base2).darken(0.5).toString()
        // top
        this.drawable.addChild(new Obstacle().set({
            x: 0,
            y: 0,
            width: this.width * game.config.size.grid,
            height: 1 * game.config.size.grid
        }).setStyle({color: color}))

        // bottom
        this.drawable.addChild(new Obstacle().set({
            x: 0,
            y: (this.height-1) * game.config.size.grid,
            width: this.width * game.config.size.grid,
            height: 1 * game.config.size.grid
        }).setStyle({color: color}))

        // left
        this.drawable.addChild(new Obstacle().set({
            x: 0,
            y: 1 * game.config.size.grid,
            width: 1 * game.config.size.grid,
            height: (this.height-2) * game.config.size.grid
        }).setStyle({color: color}))

        // right
        this.drawable.addChild(new Obstacle().set({
            x: (this.width-1) * game.config.size.grid,
            y: 1 * game.config.size.grid,
            width: 1 * game.config.size.grid,
            height: (this.height-2) * game.config.size.grid
        }).setStyle({color: color}))
    }

    constructTiles () {
        this.tiles.resize(this.width, this.height)
        this.tiles.fillRow(0, 99)
        this.tiles.fillRow(this.width-1, 99)
        this.tiles.fillCol(0, 99)
        this.tiles.fillCol(this.height-1, 99)

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

        let isSectionDivisible = true

        while (isSectionDivisible) {
            isSectionDivisible = false
            for (var i = 1; i < this.sections.length; i++) {
                let newSection = this.sections[i].divide()

                if (!newSection) continue;

                isSectionDivisible = true
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
