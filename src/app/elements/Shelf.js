import Container from '../lib/Container';
import Color from '../lib/Color';
import Item from './Item';
import game from '../Game';
import { config } from '../config';
import { inPixels, inGridTiles } from '../utils';

export default class Shelf extends Container {

    constructor() {
        super();

        this.hasItems = true;
        this.spaceBetweenItems = inPixels(1);
        this.spaceUsed = this.spaceBetweenItems;

        this.height = Math.round(inGridTiles(0.5));
        this.style.color = config.colors.aisle.shelf;
    }

    draw(ctx) {
        ctx.fillStyle = this.style.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Front edge
        ctx.fillStyle = config.colors.aisle.edges;
        ctx.fillRect(this.x, this.y + this.height - inPixels(1), this.width, inPixels(1));

        // Back edge
        ctx.fillStyle = config.colors.aisle.edges;
        ctx.fillRect(this.x, this.y, this.width, inPixels(1));

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(this.x, this.y + this.height, this.width, inPixels(1));

        super.draw(ctx);
    }

    assemble() {
        if (this.hasItems) {
            let item = this._createItem();

            while (this.hasSpaceFor(item)) {
                this.addChild(item);
                item = this._createItem();
            }
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
