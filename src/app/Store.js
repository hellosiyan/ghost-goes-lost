import SettableObject from './lib/SettableObject'
import Drawable from './lib/Drawable'
import Container from './lib/Container'
import Color from './lib/Color'
import TileGrid from './lib/TileGrid'
import Obstacle from './Obstacle'
import Shelf from './Shelf'
import Section from './Section'
import game from './Game'

export default class Store {
    constructor(difficulty) {
        let minimumSize = 6
        let difficultyToSizeRatio = 4

        this.difficulty = difficulty
        this.width = this.height = minimumSize + this.difficulty * difficultyToSizeRatio

        this.tileGrid = new TileGrid()
        this.drawable = new Container().set({
            width: this.width * game.config.size.grid,
            height: this.height * game.config.size.grid,
            visible: false
        })

        this.generateSections()
        this.constructTileGrid()
        this.createDrawables()
    }

    placePeople(player, mom) {
        let emptyTileGrid = this.tileGrid.filter(0)
        let playerTile = game.prngs.pcg.pick(emptyTileGrid)

        let possibleTileGrid = TileGrid.outsideRadius(
            emptyTileGrid,
            playerTile,
            Math.round(Math.max(this.width-2, this.height-2)/1.5)
        );
        let momTile = game.prngs.pcg.pick(possibleTileGrid)

        player.x = playerTile.x * game.config.size.grid
        player.y = playerTile.y * game.config.size.grid
        mom.x = momTile.x * game.config.size.grid
        mom.y = momTile.y * game.config.size.grid
    }

    createDrawables() {
        this.createFloorDrawable()
        this.createBorderDrawables()

        this.tileGrid.each((x, y, tile) => {
            if (!tile || tile == 99) return;

            let extensions = {
                right: 1,
                bottom: 1
            }

            while(this.tileGrid.get(x+extensions.right, y)) {
                extensions.right++;
            }

            while(this.tileGrid.get(x, y+extensions.bottom)) {
                extensions.bottom++;
            }

            this.tileGrid.fill(x, y, x+extensions.right, y+extensions.bottom, 99)
            this.tileGrid.set(x, y, tile)

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

    constructTileGrid () {
        this.tileGrid.resize(this.width, this.height)
        this.tileGrid.fillRow(0, 99)
        this.tileGrid.fillRow(this.width-1, 99)
        this.tileGrid.fillCol(0, 99)
        this.tileGrid.fillCol(this.height-1, 99)

        this.sections.forEach((section, sectionKey) =>
            this.tileGrid.overlayWith(
                section.getTileGrid(), section.x, section.y, sectionKey
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
