import Obstacle from './Obstacle'
import Color from './Color'
import game from './Game'

export default class Shelf extends Obstacle {
    constructor() {
        super()
    }

    draw (ctx) {
        let faceSize = game.config.shelf.faceSize
        // let color = this.style.color.copy().setL(20)
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

    drawShadow(ctx, s) {
        ctx.fillStyle = '#000'
        ctx.globalAlpha = 0.2
        ctx.beginPath()
        ctx.moveTo(this.x,this.y)
        ctx.lineTo(this.x+s.x,this.y+s.y)
        ctx.lineTo(this.x+s.x+this.width,this.y+s.y)
        ctx.lineTo(this.x+s.x+this.width,this.y+this.height-s.y)
        ctx.lineTo(this.x+this.width,this.y+this.height)
        ctx.fill()
    }

    drawSides(ctx, maxSize, color) {
        let pad = game.config.shelf.facePadding

        let drawRow = (ctx, color, x, y, width, height) => {
            color = color.copy();

            ctx.fillStyle = color.toString();
            ctx.fillRect(x, y, width, height);

            ctx.fillStyle = color.copy().lighten(0.3).shiftH(20).toString();
            ctx.fillRect(x+pad, y + pad, width-pad*2, height-pad*2);

            ctx.fillStyle = color.copy().lighten(0.5).shiftH(40).toString();
            ctx.fillRect(x+pad+pad, y + pad+pad, width-pad*2*2, height-pad*2*2);


            ctx.imageSmoothingEnabled = false;
            ctx.globalCompositeOperation = 'luminosity'
            let item = game.prngs.pcg.pick(Object.keys(game.sprites.items.areas))
            game.sprites.items.drawToHeight(item, ctx, x+pad+pad, y + height - pad-20-1, 20)
            ctx.globalCompositeOperation = 'source-over'
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
