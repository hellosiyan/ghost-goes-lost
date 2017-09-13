import {config} from './config'
import NumberSequence from './NumberSequence'
import Loop from './Loop'
import IO from './IO'
import Canvas from './Canvas'
import {Container} from './Drawables'
import Level from './Level'
import TextOverlay from './TextOverlay'
import Sprite from './Sprite'

class Game {
    constructor() {
        this.config = config
        this.prngs = {}
        this.sprites = {}
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
        this.initSprites()
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
        // let seed = Math.round(Math.random()*10000);
        let seed = 3829;
        this.prngs.pcg = new NumberSequence(seed)

        console.log('PCG seed: ', seed)
    }

    initSprites() {
        this.sprites.ghost = (new Sprite()).load(
                'data:image/gif;base64,R0lGODlhPQAiAKEBAJ5yVfaxjfaxjfaxjSH5BAEKAAIALAAAAAA9ACIAAALilB+pce2y1JsxTlPtzetC3j1g6IySaJ5ImpQs07zqlwCLTWJvLKs3HgAAYSsWLyhM1pLCls54TB2HOKqTJo2aisGu1QZ8KpoVFxSLHC6H4q47hx5xezCZORuPqDvkSp+YBzKn90bIsTe4lWgE0JjRGLbIoWUXmHGnOAcpJ6lBOTlV9dj4eYkpWAK05xhUWnYKGrU6hpLpCnczAkBx1pnzsruBdztTKcxZi2pp6jFMXLfj4Qv4vOwp3XadXBaNjek993wFTl4+TW2eLt2t3s7b6x6frSwvz14f74yfT79fz9ygAAA7',
                {
                    front: {x: 0, y: 0, w: 20, h: 26},
                    back: {x: 20, y: 0, w: 20, h: 26},
                    mom: {x: 40, y: 0, w: 21, h: 34}
                }
            );
        this.sprites.items = (new Sprite).load(
            'items.png',
            {
                can: {x: 0, y: 0, w: 7, h: 10},
                box1: {x: 7, y: 0, w: 9, h: 8},
                bread: {x: 16, y: 0, w: 13, h: 8},
                spray: {x: 29, y: 0, w: 6, h: 12},
                can: {x: 0, y: 10, w: 7, h: 12},
                box2: {x: 7, y: 8, w: 11, h: 10},
                bag: {x: 18, y: 8, w: 9, h: 10},
                cigs: {x: 27, y: 12, w: 6, h: 8},
            });
    }
}

const game = new Game();

export default game;
