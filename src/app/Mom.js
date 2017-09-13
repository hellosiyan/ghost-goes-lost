import {Rect} from './Drawables'
import game from './Game'

export default class Mom extends Rect {
    constructor() {
        super()

        this.direction = 0

        this.width = game.config.size.me
        let drawHeight = this.width/21*34
        this.drawHeight = Math.ceil(drawHeight)
        this.height = Math.ceil(drawHeight*0.1)

        this.x = game.config.size.grid
        this.y = game.config.size.grid

        // this.style.color = '#eac086';
        this.style.color = '#00f';
    }

    draw(ctx) {
        game.sprites.ghost.draw('mom', ctx, this.x, this.y-Math.round(this.drawHeight-this.height),this.width,this.drawHeight)
    }
}
