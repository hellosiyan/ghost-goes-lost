import { config } from './config';

import NumberSequence from './lib/NumberSequence';
import Loop from './lib/Loop';
import IO from './lib/IO';
import Canvas from './lib/Canvas';
import Container from './lib/Container';
import SpritesheetLoader from './lib/SpritesheetLoader';
import Color from './lib/Color';

import Level from './Level';
import TextOverlay from './TextOverlay';

class Game {
    constructor() {
        this.config = config;
        this.prngs = {};
        this.spritesheets = {};
        this.canvas = null;
        this.scene = null;

        this.levelNumber = 4;
        this.level = null;
        this.howtoShown = false;
    }

    init() {
        this.initCanvas();
        this.initPrngs();
        this.initLoop();
        this.initIO();
        this.initSpritesheets();
    }

    start() {
        return TextOverlay.display('<h2 class="center">Ghost Goes Lost</h2>')
            .withHowTo()
            .on('hide', () => this.playLevel(this.levelNumber));
    }

    nextLevel() {
        this.playLevel(this.levelNumber + 1);
    }

    playLevel(levelNumber) {
        this.levelNumber = levelNumber;
        this.level = new Level(this.levelNumber);

        TextOverlay.display(this.level.story)
            .on('hide', () => {
            this.level.start()
                .on('stop', () => {
                    TextOverlay.display('<p>Charlie was lost for <strong>' + this.level.totalSecondsPlayed + ' seconds</strong></p>')
                        .on('hide', () => this.nextLevel());
                });
        });
    }

    initCanvas() {
        this.canvas = new Canvas();
        this.canvas.setSize(640, 480);

        this.scene = new Container().set({
            width: this.canvas.width,
            height: this.canvas.height,
        });

        let bgColor = Color.fromHex(this.config.palette.base1).darken(0.7).toString();
        this.canvas.node.style.backgroundColor = bgColor;
        document.body.style.backgroundColor = bgColor;

        this.canvas.setScene(this.scene);
        this.canvas.appendTo(document.body);
    }

    initIO() {
        this.io = new IO();
    }

    initLoop() {
        this.loop = new Loop();
        this.loop.stats(true);
    }

    initPrngs() {
        let seed = 822505;//Math.round(Math.random()*10000);
        this.prngs.pcg = new NumberSequence(seed);

        console.log('PCG seed: ', seed);
    }

    initSpritesheets() {
        SpritesheetLoader.create(
            'data:image/gif;base64,R0lGODlhPQAiAKEBAJ5yVfaxjfaxjfaxjSH5BAEKAAIALAAAAAA9ACIAAALilB+pce2y1JsxTlPtzetC3j1g6IySaJ5ImpQs07zqlwCLTWJvLKs3HgAAYSsWLyhM1pLCls54TB2HOKqTJo2aisGu1QZ8KpoVFxSLHC6H4q47hx5xezCZORuPqDvkSp+YBzKn90bIsTe4lWgE0JjRGLbIoWUXmHGnOAcpJ6lBOTlV9dj4eYkpWAK05xhUWnYKGrU6hpLpCnczAkBx1pnzsruBdztTKcxZi2pp6jFMXLfj4Qv4vOwp3XadXBaNjek993wFTl4+TW2eLt2t3s7b6x6frSwvz14f74yfT79fz9ygAAA7',
            {
                front: { x: 0, y: 0, w: 20, h: 26 },
                back: { x: 20, y: 0, w: 20, h: 26 },
                mom: { x: 40, y: 0, w: 21, h: 34 },
            }
        ).then(spritesheet => this.spritesheets.ghost = spritesheet);

        SpritesheetLoader.create(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAWCAMAAAB9sNV1AAAA0lBMVEUAAADm20U5NhHLiEf////VMBcYMwaYTSREzZgwZgwzImYhZktzbSJqGAtgFQpNMpnVn2tFhOaOcOZnRM1HR0fPxT5NtTyrJhEiURvNzc1mZmY9PT3dsomAgIBzc3MiQnNHOHMymnKibDgmWh55PR1xWbiZmZlILo9ZWVmIHg4mUQm6urqXzbhcSJVWQ4uXTCRcWBtqnOvm5uaPj49NPX04JXBFozYzMzM3gitjOCFnYh/MzMyysrJ6nWNQUFDmXEVZhDy6sTiUSyNlYB4xHBBWEwlz9yd9AAAAAXRSTlMAQObYZgAAAXBJREFUKM99z+tWgkAUhuEPBpgKByEBlYOFoWaa2vl8rvu/pfaeCfrj8l3Lf48fewBkWQacXx9Tq9UKkFKiLY5jJsPhMMP15FB3DlkUY0lpQeVEnskssuPJZKLNpxDhuCjEWK7XyPM4J+NXy+Wy8nFgwlqIccG/UAiJzRdAZq+qqj1/1jN1ZSiaQonHj402nH/T5Xq9mRShjkhY4zGxNq056Bo0gxRNNTC4TQdshtqYbmaA1NV1DTJpegJCTGA3waSCANRJmqYDRr4P2J3E4hJGSqm+25h7Nt63Rybp/GVDua7bd5Uxt8Y8sLE6VjNEaM4zGg2Y/BuHsiwyCNQPqFFZjqDJ/v6Z1+6wUWruzpXCiP5zOTKEkdnRhr7E97iqnE6nV6U2L4Q8O2l3AgKMgtKheOcouoii6Kh5fJLYgSb9Ppm3qXPKxnEihwzsJqhAZ+4h0+5s6fTqabF41fe88z1bTZ7f3cVs+Fn0+J151G7yC0hNJKirD/bzAAAAAElFTkSuQmCC',
            {
                can: { x: 0, y: 0, w: 7, h: 10 },
                box1: { x: 7, y: 0, w: 9, h: 8 },
                bread: { x: 16, y: 0, w: 13, h: 8 },
                spray: { x: 29, y: 0, w: 6, h: 12 },
                can: { x: 0, y: 10, w: 7, h: 12 },
                box2: { x: 7, y: 8, w: 11, h: 10 },
                bag: { x: 18, y: 8, w: 9, h: 10 },
                cigs: { x: 27, y: 12, w: 6, h: 8 },
            }
        ).then(spritesheet => this.spritesheets.items = spritesheet);
    }
}

const game = new Game();

export default game;
