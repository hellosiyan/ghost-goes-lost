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

        this.drawShadow(ctx, {x:14, y: faceSize/2})

        ctx.fillStyle = color.toString();
        ctx.globalAlpha = 1;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        this.drawSides(ctx, faceSize, color.copy())

        ctx.fillStyle = color.darken(0.2).toString();
        ctx.fillRect(this.x, this.y, this.width, this.height - faceSize);

        return this;
    }

    drawShadow(ctx, size) {
        ctx.fillStyle = '#000'
        ctx.globalAlpha = 0.2
        ctx.beginPath()
        ctx.moveTo(this.x,this.y)
        ctx.lineTo(this.x+size.x,this.y+size.y)
        ctx.lineTo(this.x+size.x+this.width,this.y+size.y)
        ctx.lineTo(this.x+size.x+this.width,this.y+this.height-size.y)
        ctx.lineTo(this.x+this.width,this.y+this.height)
        ctx.fill()
    }

    drawSides(ctx, maxSize, color) {
        let pad = game.config.shelf.facePadding

        let drawRow = (ctx, color, x, y, width, height) => {
            color = color.copy();

            ctx.fillStyle = color.toString();
            ctx.fillRect(x, y, width, height);

            ctx.fillStyle = color.copy().lighten(0.3).shiftHue(20).toString();
            ctx.fillRect(x+pad, y + pad, width-pad*2, height-pad*2);

            ctx.fillStyle = color.copy().lighten(0.5).shiftHue(40).toString();
            ctx.fillRect(x+pad+pad, y + pad+pad, width-pad*2*2, height-pad*2*2);

            let item = game.prngs.pcg.pick(Object.keys(game.sprites.items.areas))
            let itemWidth = Math.min(30, Math.round((width-pad*4)*0.9))
            let itemX = Math.round(game.prngs.pcg.next()*(width-itemWidth-pad*2*2))
            let chance = Math.pow(1 - (itemWidth)/(width), 2)

            if (game.prngs.pcg.next() < chance) {
                ctx.imageSmoothingEnabled = false;
                ctx.globalCompositeOperation = 'luminosity'
                game.sprites.items.drawToFit(item, ctx, x+pad+pad+itemX, y + height - pad-20-1, itemWidth, 20)
                ctx.globalCompositeOperation = 'source-over'
            }
        }

        let totalRows = game.prngs.pcg.pick([2,3]);
        let isHorizontal = this.width >= this.height

        for (var i = totalRows; i >= 1; i--) {
            let size = Math.round(maxSize * (i/totalRows));
            if (isHorizontal) {
               drawRow(ctx, color, this.x, this.y+this.height-maxSize, this.width, size)
            } else {
                let faceWidth = Math.round(this.width/2)-10
                drawRow(ctx, color, this.x, this.y+this.height-maxSize, faceWidth, size)
                drawRow(ctx, color, this.x + this.width - faceWidth, this.y+this.height-maxSize, faceWidth, size)
            }
        }

    }
}
