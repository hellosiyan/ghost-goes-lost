import {config} from './config'
import NumberSequence from './NumberSequence'
import Loop from './Loop'
import IO from './IO'
import Canvas from './Canvas'
import {Container} from './Drawables'
import Level from './Level'

class Game {
    constructor() {
        this.config = config
        this.prngs = {}
        this.canvas = null
        this.scene = null

        this.levelNumber = 1
        this.level = null
    }

    init() {
        this.initCanvas()
        this.initPrngs()
        this.initLoop()
        this.initIO()
    }

    playLevel(levelNumber) {
        this.levelNumber = levelNumber
        this.level = new Level(this.levelNumber)

        this.canvas.setScene(this.level.scene);
        this.loop.start(dt => this.level.loopHandler(dt))
    }

    initCanvas() {
        this.canvas = new Canvas();
        this.scene = new Container().set({
            width: this.canvas.width,
            height: this.canvas.height
        });

        this.canvas.setScene(this.scene);
        this.canvas.appendTo(document.body);

        this.cameraBoundry = {
            left: Math.round(this.canvas.width * 0.35),
            bottom: this.canvas.height - Math.round(this.canvas.height * 0.35),
            right: this.canvas.width - Math.round(this.canvas.width * 0.35),
            top: Math.round(this.canvas.height * 0.35)
        }
    }

    initIO() {
        this.io = new IO()
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
