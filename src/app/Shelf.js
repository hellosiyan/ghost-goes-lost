import Container from './lib/Container';
import Item from './elements/Item';
import game from './Game';
import { inPixels, inGridTiles } from './utils';

export default class Shelf extends Container {

    constructor() {
        super();

        this.height = Math.round(inGridTiles(0.5));
        this.spaceBetweenItems = inPixels(1);
        this.spaceUsed = 0;
    }

    assemble() {
        const randomType = () => game.prngs.pcg.pick(Item.types()).name;
        const createItem = () => Item.create(randomType()).set({
            y: -1 * Math.round(this.height / 2),
        });

        let item = createItem();

        while (this.hasSpaceFor(item)) {
            this.addChild(item);
            item = createItem();
        }

        this.cache();

        return this;
    }

    hasSpaceFor(child) {
        return this.spaceUsed + child.width + this.spaceBetweenItems < this.width;
    }

    addChild(child) {
        if (Array.isArray(child)) {
            return super.addChild(child);
        }

        child.x = this.spaceUsed;
        this.spaceUsed += child.width + this.spaceBetweenItems;

        return super.addChild(child);
    }

    removeChild (child) {
        this.spaceUsed -= child.width + this.spaceBetweenItems;

        return super.removeChild(child);
    }
}
