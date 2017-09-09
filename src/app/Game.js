import {config} from './config'
import NumberSequence from './NumberSequence'
import Loop from './Loop'
import IO from './IO'
import Canvas from './Canvas'
import {Container} from './Drawables'
import Level from './Level'
import TextOverlay from './TextOverlay'

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

    playIntro() {
        TextOverlay.display('<h2>Lost Between Shelves</h2><p> Siyan Panayotov &middot; js13kGames 2017</p>')
            .addNext(() => {
                TextOverlay.display('<p>Move with WASD, ZQSD, or arrows</p>')
                    .addNext(() => {
                        this.playLevel(1)
                    })
            })
    }

    nextLevel() {
        this.playLevel(this.levelNumber+1)
    }

    playLevel(levelNumber) {
        this.levelNumber = levelNumber;
        this.playStory(() => {
            this.level = new Level(this.levelNumber)

            this.level.onLevelEnd = () => {
                game.loop.stop()
                TextOverlay.display('<h2>Mom!! &lt;3</h2>').addNext(() => this.nextLevel())
            }

            this.canvas.setScene(this.level.scene);
            this.loop.start(dt => this.level.loopHandler(dt))
        })
    }

    playStory(onDone){
        TextOverlay.display('<h2>Story #'+this.levelNumber+'</h2><p>Lorm ipsum dolor sit amet.</p>')
            .addNext(onDone)
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
