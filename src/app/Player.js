import Rect from './lib/Rect'
import game from './Game'

export default class Player extends Rect {
    constructor() {
        super()

        this.direction = {
            x: '', // [ud]
            y: '' // [lr]
        };

        this.width = game.config.size.me
        let drawHeight = this.width/20*26
        this.drawHeight = Math.ceil(drawHeight)
        this.height = Math.ceil(drawHeight*0.1)

        this.x = game.config.size.grid
        this.y = game.config.size.grid

        this.levitationTimeInterval = 0;
    }

    draw(ctx) {
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        let r = this.width/19
        let spriteName = this.direction.y == 'u' ? 'back': 'front';

        this.levitationTimeInterval = (this.levitationTimeInterval + game.loop.dt)%2;
        let levitationHeightRatio = Math.abs(this.levitationTimeInterval-1)/1;
        let levitationY = Math.round(levitationHeightRatio*this.drawHeight*0.2)

        if (this.direction.x == 'r') {
            ctx.scale(-1,1)
            game.spritesheets.ghost.draw(spriteName, ctx,-1*this.x-this.width, this.y-Math.round(this.drawHeight-this.height)-levitationY,this.width,this.drawHeight)
        } else {
            game.spritesheets.ghost.draw(spriteName, ctx, this.x, this.y-Math.round(this.drawHeight-this.height)-levitationY,this.width,this.drawHeight)
        }
    }

    move() {
        if (game.io.left) {
            this.x -= game.config.speed.move * game.loop.dt
            this.direction.x = 'l'
        } else if (game.io.right) {
            this.x += game.config.speed.move * game.loop.dt
            this.direction.x = 'r'
        } else {
            this.direction.x = ''
        }

        if (game.io.up) {
            this.y -= game.config.speed.move * game.loop.dt
            this.direction.y = 'u'
        } else if (game.io.down) {
            this.y += game.config.speed.move * game.loop.dt
            this.direction.y = 'd'
        } else {
            this.direction.y = ''
        }
    }
}
