import Obstacle from './Obstacle'
import Color from './Color'
import game from './Game'

export default class Shelf extends Obstacle {
    constructor() {
        super()
    }

    draw (ctx) {
        let faceSize = game.config.shelf.faceSize
        let color = this.style.color.copy().setL(20)

        ctx.fillStyle = color.toString();
        ctx.fillRect(this.x, this.y, this.width, this.height);

        this.drawSides(ctx, faceSize, color.copy())

        ctx.fillStyle = color.darken(0.2).toString();
        ctx.fillRect(this.x, this.y, this.width, this.height - faceSize);


        return this;
    }

    drawSides(ctx, maxSize, color) {
        let pad = game.config.shelf.facePadding

        let drawRow = (ctx, color, x, y, width, height) => {
            color = color.copy();

            ctx.fillStyle = color.toString();
            ctx.fillRect(x, y, width, height);

            ctx.fillStyle = color.setL(92).toString();
            ctx.fillRect(x+pad, y + pad, width-pad*2, height-pad*2);

            ctx.fillStyle = color.setL(100).toString();
            ctx.fillRect(x+pad+pad, y + pad+pad, width-pad*2*2, height-pad*2*2);
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