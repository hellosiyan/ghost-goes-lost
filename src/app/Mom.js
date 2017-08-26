import {Rect} from './Drawables'
import game from './Game'

export default class Mom extends Rect {
    constructor() {
        super()

        this.direction = 0

        this.width = game.config.size.me
        this.height = game.config.size.me
        this.x = game.config.size.grid
        this.y = game.config.size.grid

        // this.style.color = '#eac086';
        this.style.color = '#00f';
    }
}
