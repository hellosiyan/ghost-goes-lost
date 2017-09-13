import {Rect} from './Drawables'
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

        this.style.color = '#f0f';
    }

    draw(ctx) {
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        let r = this.width/19
        let sprite = this.direction.y == 'u' ? 'back': 'front';

        if (this.direction.x == 'r') {
            ctx.scale(-1,1)
            game.sprites.ghost.draw(sprite, ctx,-1*this.x-this.width, this.y-Math.round(this.drawHeight-this.height),this.width,this.drawHeight)
        } else {
            game.sprites.ghost.draw(sprite, ctx, this.x, this.y-Math.round(this.drawHeight-this.height),this.width,this.drawHeight)
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
