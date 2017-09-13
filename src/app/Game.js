import {config} from './config'
import NumberSequence from './NumberSequence'
import Loop from './Loop'
import IO from './IO'
import Canvas from './Canvas'
import {Container} from './Drawables'
import Level from './Level'
import TextOverlay from './TextOverlay'
import Sprite from './Sprite'
import Color from './Color'
import story from './Story'

class Game {
    constructor() {
        this.config = config
        this.prngs = {}
        this.sprites = {}
        this.canvas = null
        this.scene = null

        this.levelNumber = 1
        this.level = null
        this.howtoShown = false
    }

    init() {
        this.initCanvas()
        this.initPrngs()
        this.initLoop()
        this.initIO()
        this.initSprites()
    }

    playIntro() {
        TextOverlay.display('<h2 class="center">Ghost Goes Lost</h2><p class="center"> Siyan Panayotov &middot; js13kGames 2017</p>').addNext(() => {
                TextOverlay.display('<p>Charlie is a 7 year old ghost.</p>').addNext(() => {
                    TextOverlay.display('<p>He likes haunting vacated supermarkets<br>with his shopaholic mother.</p>').addNext(() => {
                        TextOverlay.display('<p>Too slow to glide around after her<br>he is now lost.</p>').addNext(() => {
                            TextOverlay.display('<p>Help Charlie find his mom!</p>').addNext(() => {
                                this.playLevel(this.levelNumber)
                            })
                        })
                    })
                })
            })
    }

    showHowTo(onDone) {
        if (this.howtoShown) {
            setTimeout(() => onDone(), 1)
            return this;
        }

        this.howtoShown = true
        TextOverlay.display('<p>Glide with <strong>wasd</strong>, <strong>zqsd</strong>, or <strong>arrow</strong> keys</p>')
            .addNext(onDone)

        return this
    }

    nextLevel() {
        if (this.levelNumber == 5) {
            TextOverlay.display('<h3>Charlie thanks you for your help</h3>').addNext(() => {
                TextOverlay.display('<h3>Game\'s over</h3><p>But you can still help lost Charlie in the afterlife!</p>').addNext(() => {
                    TextOverlay.display('<p><strong>Play for eternity</strong></p>').addNext(() => {
                        this.playLevel(this.levelNumber+1)
                    })
                })
            })
        } else {
            this.playLevel(this.levelNumber+1)
        }
    }

    playLevel(levelNumber) {
        this.levelNumber = levelNumber;

        this.playStory(() => {
            let start = (new Date()).getTime();
            this.level = new Level(this.levelNumber)

            this.level.onLevelEnd = () => {
                game.loop.stop()
                let end = (new Date()).getTime();
                TextOverlay.display('<p>Charlie was lost for <strong>'+Math.ceil((end-start)/1000)+' seconds</strong>, but<br> <strong>you saved him!</strong></p><p>For now.</p><p>A few years would pass<br>before he finds himself alone again.</p>').addNext(() => this.nextLevel())
            }

            this.canvas.setScene(this.level.scene);
            this.loop.start(dt => this.level.loopHandler(dt))
        })
    }

    playStory(onDone){
        let storyObj = story(this.levelNumber);

        TextOverlay.display('<h3>'+storyObj.title+'</h3><p>'+storyObj.text+'</p>')
            .addNext(() => {
                this.showHowTo(onDone)
            })
    }

    initCanvas() {
        this.canvas = new Canvas();
        this.scene = new Container().set({
            width: this.canvas.width,
            height: this.canvas.height
        });

        let bgColor = Color.fromHex(this.config.palette.base1).darken(0.7).toString();
        this.canvas.node.style.backgroundColor = bgColor;
        document.body.style.backgroundColor = bgColor;

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
        let seed = 822505;//Math.round(Math.random()*10000);
        this.prngs.pcg = new NumberSequence(seed)
        this.prngs.story = new NumberSequence(3829)

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
