import {Rect} from './Drawables'
import game from './Game'

export default class Player extends Rect {
    constructor() {
        super()

        this.direction = 0

        this.width = game.config.size.me
        this.height = game.config.size.me
        this.x = game.config.size.grid
        this.y = game.config.size.grid

        this.style.color = '#f0f';
    }

    move() {
        if (game.io.left) {
            this.x -= game.config.speed.move * game.loop.dt
        } else if (game.io.right) {
            this.x += game.config.speed.move * game.loop.dt
        }

        if (game.io.up) {
            this.y -= game.config.speed.move * game.loop.dt
        } else if (game.io.down) {
            this.y += game.config.speed.move * game.loop.dt
        }
    }
}
