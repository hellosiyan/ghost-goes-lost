import Drawable from '../lib/Drawable';

export default class TileFloor extends Drawable {
    constructor() {
        super();

        this.tilePadding = 1;
        this.tileWidth = 10;
        this.tileHeight = 10;
        this.tile = document.createElement('canvas');
    }

    draw(ctx) {
        this.drawTile();

        ctx.fillStyle = ctx.createPattern(this.tile, 'repeat');
        ctx.globalAlpha = this.style.opacity;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    drawTile() {
        let ctx = this.tile.getContext('2d');

        this.tile.width = this.tileWidth;
        this.tile.height = this.tileHeight;

        // Base color
        ctx.fillStyle = this.style.color.copy().lighten(0.1).toString();
        ctx.fillRect(
            0,
            0,
            this.tileWidth,
            this.tileHeight
        );

        // Padded base
        ctx.fillStyle = this.style.color.copy().darken(0.25).toString();
        ctx.fillRect(
            this.tilePadding,
            this.tilePadding,
            this.tileWidth,
            this.tileHeight
        );

        // 2nd padded base
        ctx.fillStyle = this.style.color.copy().toString();
        ctx.fillRect(
            this.tilePadding * 2,
            this.tilePadding * 2,
            this.tileWidth - this.tilePadding * 2,
            this.tileHeight - this.tilePadding * 2
        );
    }
}
