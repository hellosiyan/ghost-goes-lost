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

        this.levitationTimeInterval = 1;
    }

    draw(ctx) {
        this.levitationTimeInterval = (this.levitationTimeInterval + game.loop.dt)%2;
        let levitationHeightRatio = Math.abs(this.levitationTimeInterval-1)/1;
        let levitationY = Math.round(levitationHeightRatio*this.drawHeight*0.2)

        game.spritesheets.ghost.draw('mom', ctx, this.x, this.y-Math.round(this.drawHeight-this.height) - levitationY,this.width,this.drawHeight)
    }
}
