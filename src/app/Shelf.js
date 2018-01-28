import Container from './lib/Container';
import Item from './elements/Item';
import game from './Game';
import { inPixels, inGridTiles } from './utils';

export default class Shelf extends Container {

    constructor() {
        super();

        this.height = Math.round(inGridTiles(0.4));
        this.spaceBetweenItems = inPixels(1);
        this.spaceUsed = 0;
    }

    assemble() {
        let item = this._createItem();

        while (this.hasSpaceFor(item)) {
            this.addChild(item);
            item = this._createItem();
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

    removeChild(child) {
        this.spaceUsed -= child.width + this.spaceBetweenItems;

        return super.removeChild(child);
    }

    _createItem() {
        const type = game.prngs.pcg.pick(Item.types()).name;

        const item = Item.create(type)
            .alignWith(this.innerBox).bottomEdges();

        item.y -= inPixels(3);

        return item;
    }
}
