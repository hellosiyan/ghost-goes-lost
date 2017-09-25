import Rect from './lib/Rect'
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
    }

    draw(ctx) {
        let levitateY = Math.round(Math.abs((game.loop.count+50)%100-50)/100*this.drawHeight*0.3)

        game.sprites.ghost.draw('mom', ctx, this.x, this.y-Math.round(this.drawHeight-this.height) - levitateY,this.width,this.drawHeight)
    }
}
