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

        // Item
        if (game.prngs.pcg.next() >= 0.5) {
            return;
        }

        const itemWidth = Math.min(
            game.config.shelf.minItemWidth,
            Math.round((width - padding * 4) * 0.9)
        );

        const itemX = Math.round(game.prngs.pcg.next() * (width - padding * 4 - itemWidth));

        this.drawItem(
            ctx,
            game.prngs.pcg.pick(game.spritesheets.items.sprites),
            x + padding * 2 + itemX,
            y - padding * 2 + height,
            itemWidth
        );
    }

    drawItem(ctx, item, x, y, width) {
        const sprite = game.spritesheets.items.get(item);

        ctx.imageSmoothingEnabled = false;
        ctx.globalCompositeOperation = 'luminosity';
        game.spritesheets.items.drawToFit(item, ctx, x, y - sprite.height, sprite.width, sprite.height);
        ctx.globalCompositeOperation = 'source-over';
    }
}
