import Drawable from './lib/Drawable';
import Color from './lib/Color';
import Collidable from './Collidable';
import game from './Game';

export default class Aisle extends Collidable(Drawable) {
    draw (ctx) {
        const faceSize = game.config.shelf.faceSize;
        const shadowSize = game.config.shelf.shadowSize;
        const color = Color.fromHex(game.config.palette.base2);

        // Shadow
        this.drawShadow(ctx, { x: shadowSize, y: faceSize / 2 });

        // Front Section (Base)
        ctx.fillStyle = color.toString();
        ctx.globalAlpha = 1;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Rows
        this.drawShelves(ctx, faceSize, color.copy());

        // Top
        ctx.fillStyle = color.darken(0.2).toString();
        ctx.fillRect(this.x, this.y, this.width, this.height - faceSize);

        return this;
    }

    drawShadow(ctx, size) {
        ctx.fillStyle = '#000';
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.moveTo(this.x + size.x, this.y + size.y);
        ctx.lineTo(this.x + size.x + this.width, this.y + size.y);
        ctx.lineTo(this.x + size.x + this.width, this.y + this.height - size.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.fill();
    }

    drawShelves(ctx, maxHeight, color) {
        const totalRows = game.prngs.pcg.pick([2, 3]);
        const isHorizontal = this.width >= this.height;
        const shelfWidth = isHorizontal ? this.width : Math.round(this.width / 2) - game.config.shelf.sideSpacing;

        for (var i = totalRows; i >= 1; i--) {
            const shelfHeight = Math.round(maxHeight * (i / totalRows));
            const dropShadow = i != totalRows;

            if (isHorizontal) {
                this.drawShelf(ctx, color, this.x, this.y + this.height - maxHeight, shelfWidth, shelfHeight, dropShadow);
            } else {
                // Left side
                this.drawShelf(
                    ctx, color,
                    this.x,
                    this.y + this.height - maxHeight,
                    shelfWidth,
                    shelfHeight,
                    dropShadow
                );

                // Right side
                this.drawShelf(
                    ctx, color,
                    this.x + this.width - shelfWidth,
                    this.y + this.height - maxHeight,
                    shelfWidth,
                    shelfHeight,
                    dropShadow
                );
            }
        }
    }

    drawShelf (ctx, color, x, y, width, height, withShadow) {
        const padding = game.config.shelf.facePadding;

        // Bottom shadow
        if (withShadow) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#000';
            ctx.fillRect(x + padding, y + height, width - padding * 2, padding);
            ctx.globalAlpha = 1;
        }

        // Bottom line
        ctx.fillStyle = color.toString();
        ctx.fillRect(x, y, width, height);

        // Inner shadow
        ctx.fillStyle = color.copy().lighten(0.3).shiftHue(20).toString();
        ctx.fillRect(
            x + padding,
            y + padding,
            width - padding * 2,
            height - padding * 2
        );

        // Shelf
        ctx.fillStyle = color.copy().lighten(0.5).shiftHue(40).toString();
        ctx.fillRect(
            x + padding * 2,
            y + padding * 2,
            width - padding * 4,
            height - padding * 4
        );

        // Items
        const sizeRatio = game.config.shelf.itemScaleRatio;
        const shelfSparcity = game.prngs.pcg.pick([0.1, 0.3, 0.5, 0.7]);
        let totalItemsLength = 0;

        while (totalItemsLength < width - padding * 4) {
            const item = game.spritesheets.items.get(game.prngs.pcg.pick(game.spritesheets.items.sprites));
            const repeatItem = game.prngs.pcg.pick([1, 2, 3, 4]);

            item.width *= sizeRatio;
            item.height *= sizeRatio;

            if (game.prngs.pcg.next() >= shelfSparcity) {
                totalItemsLength += item.width;
                continue;
            }

            for (var i = 0; i < repeatItem; i++) {
                if (totalItemsLength + item.width >= width - padding * 4) {
                    break;
                }

                this.drawItem(
                    ctx,
                    item.name,
                    x + padding * 2 + totalItemsLength,
                    y - padding * 2 + height,
                    item.width,
                    item.height
                );

                totalItemsLength += item.width + 2 * sizeRatio;
            }
        }
    }

    drawItem(ctx, itemName, x, y, width, height) {
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        ctx.globalCompositeOperation = 'luminosity';
        game.spritesheets.items.draw(itemName, ctx, x, y - height, width, height);
        ctx.globalCompositeOperation = 'source-over';

        ctx.globalAlpha = 0.3;
        game.spritesheets.items.draw(itemName, ctx, x, y - height, width, height);
        ctx.globalAlpha = 1;
    }
}
