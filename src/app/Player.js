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

        this.speed = {
            x: 0,
            y: 0
        }
    }

    draw(ctx) {
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        let spriteName = this.direction.y == 'u' ? 'back': 'front';

        this.levitationTimeInterval = (this.levitationTimeInterval + game.loop.dt) % 2;
        let levitationHeightRatio = Math.abs(this.levitationTimeInterval - 1);
        let levitationY = Math.round(levitationHeightRatio * this.drawHeight * 0.2)

        let x = this.x;
        let y = this.y - Math.round(this.drawHeight - this.height) - levitationY

        if (this.direction.x == 'r') {
            ctx.scale(-1, 1)
            x = -1 * this.x - this.width;
        }

        game.spritesheets.ghost.draw(spriteName, ctx, x, y, this.width, this.drawHeight)
    }

    move() {
        if (! game.io.left && ! game.io.right ) {
            this.speed.x = 0;
        } else {
            const newDirection = game.io.left ? 'l': 'r';

            if (this.direction.x === newDirection) {
                this.speed.x += game.config.speed.acceleration * game.loop.dt;
            } else {
                this.speed.x = game.config.speed.initial * game.loop.dt;
            }

            this.speed.x = Math.min(this.speed.x, game.config.speed.max)

            this.direction.x = newDirection

            if (this.direction.x == 'l') {
                this.x -= this.speed.x * game.loop.dt
            } else  {
                this.x += this.speed.x * game.loop.dt
            }
        }

        if (! game.io.up && ! game.io.down ) {
            this.speed.y = 0;
        } else {
            const newDirection = game.io.up ? 'u': 'd';

            if (this.direction.y === newDirection) {
                this.speed.y += game.config.speed.acceleration * game.loop.dt;
            } else {
                this.speed.y = game.config.speed.initial * game.loop.dt;
            }

            this.speed.y = Math.min(this.speed.y, game.config.speed.max)

            this.direction.y = newDirection

            if (this.direction.y == 'u') {
                this.y -= this.speed.y * game.loop.dt
            } else  {
                this.y += this.speed.y * game.loop.dt
            }
        }
    }
}
