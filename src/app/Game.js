import {config} from './config'
import NumberSequence from './NumberSequence'
import Player from './Player'
import Mom from './Mom'
import Loop from './Loop'
import IO from './IO'

class Game {
    constructor() {
        this.config = config
        this.player = null
        this.mom = null
        this.prngs = {}
    }

    init() {
        this.initPrngs()
        this.initPlayer()
        this.initMom()
        this.initLoop()
        this.initIO()
    }

    initIO() {
        this.io = new IO()
    }

    initPlayer() {
        this.player = new Player()
    }

    initMom() {
        this.mom = new Mom()
    }

    initLoop() {
        this.loop = new Loop()
        this.loop.stats(true)
    }

    initPrngs() {
        this.prngs.pcg = new NumberSequence(Math.round(Math.random()*10000))
        // this.prngs.pcg = new NumberSequence(4)
    }
}

const game = new Game();

export default game;
