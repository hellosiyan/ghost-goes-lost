import Obstacle from './Obstacle'
import Color from './lib/Color'
import game from './Game'

export default class Shelf extends Obstacle {
    constructor() {
        super()
    }

    draw (ctx) {
        let faceSize = game.config.shelf.faceSize
        let color = Color.fromHex(game.config.palette.base2)

        // Shadow
        this.drawShadow(ctx, {x:14, y: faceSize/2})

        // Front Section (Base)
        ctx.fillStyle = color.toString();
        ctx.globalAlpha = 1;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Rows
        this.drawShelves(ctx, faceSize, color.copy())

        // Top
        ctx.fillStyle = color.darken(0.2).toString();
        ctx.fillRect(this.x, this.y, this.width, this.height - faceSize);

        return this;
    }

    drawShadow(ctx, size) {
        ctx.fillStyle = '#000'
        ctx.globalAlpha = 0.2
        ctx.beginPath()
        ctx.moveTo(this.x + size.x, this.y + size.y)
        ctx.lineTo(this.x + size.x + this.width, this.y + size.y)
        ctx.lineTo(this.x + size.x + this.width, this.y + this.height-size.y)
        ctx.lineTo(this.x + this.width, this.y + this.height)
        ctx.fill()
    }

    drawShelves(ctx, maxHeight, color) {
        const shelfWidth = Math.round(this.width / 2) - 10

        const totalRows = game.prngs.pcg.pick([2,3]);
        const isHorizontal = this.width >= this.height

        for (var i = totalRows; i >= 1; i--) {
            const size = Math.round(maxHeight * (i / totalRows));

            if (isHorizontal) {
                this.drawShelf(ctx, color, this.x, this.y + this.height - maxHeight, this.width, size)
            } else {
                this.drawShelf(ctx, color, this.x, this.y + this.height - maxHeight, shelfWidth, size)
                this.drawShelf(ctx, color, this.x + this.width - shelfWidth, this.y + this.height - maxHeight, shelfWidth, size)
            }
        }
    }

    drawShelf (ctx, color, x, y, width, height) {
        const facePadding = game.config.shelf.facePadding

        // Bottom line
        ctx.fillStyle = color.toString();
        ctx.fillRect(x, y, width, height);

        // Inner shadow
        ctx.fillStyle = color.copy().lighten(0.3).shiftHue(20).toString();
        ctx.fillRect(x + facePadding, y + facePadding, width - facePadding * 2, height - facePadding * 2);

        // Shelf
        ctx.fillStyle = color.copy().lighten(0.5).shiftHue(40).toString();
        ctx.fillRect(x + facePadding + facePadding, y + facePadding + facePadding, width - facePadding * 2 * 2, height - facePadding * 2 * 2);

        // Item
        if (game.prngs.pcg.next() < 0.5) {
            let itemWidth = Math.min(30, Math.round((width - facePadding * 4) * 0.9))
            let itemX = Math.round(game.prngs.pcg.next() * (width - itemWidth - facePadding * 2 * 2))

            this.drawItem(
                ctx,
                game.prngs.pcg.pick(Object.keys(game.spritesheets.items.sprites)),
                x + facePadding + facePadding + itemX,
                y + height - facePadding - 20 - 1,
                itemWidth
            );
        }
    }

    drawItem(ctx, item, x, y, width) {
        ctx.imageSmoothingEnabled = false
        ctx.globalCompositeOperation = 'luminosity'
        game.spritesheets.items.drawToFit(item, ctx, x, y, width, 20)
        ctx.globalCompositeOperation = 'source-over'
    }
}
