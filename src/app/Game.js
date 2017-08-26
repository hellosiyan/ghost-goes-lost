import {config} from './config'
import NumberSequence from './NumberSequence'

class Game {
    constructor() {
        this.config = config
        this.prngs = {}
    }

    init() {
        this.initPrngs()
    }

    initPrngs() {
        // this.prngs.pcg = new NumberSequence(Math.round(Math.random()*10000))
        this.prngs.pcg = new NumberSequence(3)
    }
}

const game = new Game();

export default game;
