import Container from './lib/Container';
import Item from './elements/Item';
import game from './Game';
import { inPixels, inGridTiles } from './utils';

export default class Shelf extends Container {

    constructor() {
        super();

        this.height = Math.round(inGridTiles(0.5));
    }

    assemble() {
        const randomType = () => game.prngs.pcg.pick(Item.types()).name;
        const items = [];
        const spacing = inPixels(1);
        let spaceUsed = spacing;

        while (spaceUsed < this.width) {
            const item = Item.create(randomType())
                .set({
                    x: spaceUsed,
                    y: -1 * Math.round(this.height / 2),
                });

            items.push(item);

            spaceUsed += item.width + spacing;
        }

        // If the items overflow, drop the last one
        if (spaceUsed > this.width) {
            spaceUsed -= items.pop().width + spacing;

            const spaceLeft = this.width - spaceUsed;

            items[items.length - 1].x += spaceLeft;
        }

        this.addChild(items);

        this.cache();
    }
}
