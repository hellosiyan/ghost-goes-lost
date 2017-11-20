import Container from './lib/Container'
import Color from './lib/Color'
import TileGrid from './lib/TileGrid'
import Aisle from './Aisle'
import Section from './Section'
import game from './Game'

import TileFloor from './elements/TileFloor'
import Wall from './elements/Wall'

const borderTile = 99;
const emptyTile = 0;

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

        this.sections = [];

        this.generateSections()
        this.constructTileGrid()
        this.createDrawables()
    }

    placePeople(player, mom) {
        let emptyTileGrid = this.tileGrid.filter(emptyTile)
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
        this.drawable.addChild(this.createFloor());
        this.drawable.addChild(this.createWalls());
        this.drawable.addChild(this.createShelves());

        this.drawable.cache()
    }

    createFloor() {
        let floor = new TileFloor();

        floor.style.color = Color.fromHex(game.config.palette.base1).darken(0.2);

        floor.set({
            tilePadding: 1,
            tileWidth: Math.round(game.config.size.grid / 4),
            tileHeight: Math.round(game.config.size.grid / 4),
            x: 0,
            y: 0,
            width: this.width * game.config.size.grid,
            height: this.height * game.config.size.grid
        });

        return floor;
    }

    createWalls() {
        let color = Color.fromHex(game.config.palette.base2).darken(0.5).toString();
        let walls = [];

        // top
        walls.push(new Wall().set({
            x: 0,
            y: 0,
            width: this.width * game.config.size.grid,
            height: 1 * game.config.size.grid
        }));

        // bottom
        walls.push(new Wall().set({
            x: 0,
            y: (this.height-1) * game.config.size.grid,
            width: this.width * game.config.size.grid,
            height: 1 * game.config.size.grid
        }));

        // left
        walls.push(new Wall().set({
            x: 0,
            y: 0,
            width: 1 * game.config.size.grid,
            height: this.height * game.config.size.grid
        }));

        // right
        walls.push(new Wall().set({
            x: (this.width-1) * game.config.size.grid,
            y: 0,
            width: 1 * game.config.size.grid,
            height: this.height * game.config.size.grid
        }));

        walls.forEach(wall => wall.setStyle({color}));

        return walls;
    }

    createShelves() {
        const shelves = [];
        const grid = this.tileGrid.copy();
        const skipTiles = [emptyTile, borderTile]

        grid.each((x, y, tile) => {
            if (skipTiles.includes(tile)) return;

            let area = grid.continuousSelect(x, y);

            grid.fill(x, y, x + area.width, y + area.height, emptyTile);

            shelves.push(new Aisle()
                .set({
                    x: x * game.config.size.grid,
                    y: y * game.config.size.grid,
                    width: area.width * game.config.size.grid,
                    height: area.height * game.config.size.grid
                })
            );
        });

        return shelves;
    }

    constructTileGrid() {
        this.tileGrid
            .resize(this.width, this.height)
            .fillBorder(borderTile);

        this.sections.forEach((section, sectionKey) =>
            this.tileGrid.overlayWith(
                section.getTileGrid(), section.x, section.y, sectionKey
            )
        )
    }

    generateSections() {
        // 1 block for borders + 1 block for aisles around the store
        let padding = 2;

        this.sections[1] = new Section().set({
            x: padding,
            y: padding,
            w: this.width - padding * 2,
            h: this.height - padding * 2,
            color: game.prngs.pcg.color()
        })

        let isSectionDivisible = true

        while (isSectionDivisible) {
            isSectionDivisible = false;

            this.sections.forEach(section => {
                let newSection = section.divide()

                if (!newSection) return;

                isSectionDivisible = true
                this.sections.push(newSection)
            });
        }

        return this.sections
    }
}
