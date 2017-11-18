import SettableObject from './lib/SettableObject'
import Container from './lib/Container'
import Player from './Player'
import Mom from './Mom'
import Store from './Store'
import Listenable from './Listenable'
import game from './Game'
import story from './Story'

export default class Level extends Listenable(SettableObject) {
    constructor(number) {
        super()

        this.number = number
        this.startedAt = 0;
        this.totalSecondsPlayed = 0;

        this.story = story(this.number);

        this.store = new Store(this.number)
        this.player = new Player()
        this.mom = new Mom()

        this.drawable = new Container();
    }

    start() {
        let scene = this.prepareScene();

        game.canvas.setScene(scene);
        game.loop.start(dt => this.loopHandler(dt))

        this.startedAt = (new Date()).getTime();

        return this;
    }

    stop() {
        game.canvas.draw();
        game.loop.stop();

        this.totalSecondsPlayed = Math.ceil(((new Date()).getTime() - this.startedAt)/1000);

        this.emit('stop');
    }

    loopHandler(dt) {
        this.player.move()

        this.detectCollisions();

        if (this.player.intersects(this.mom)) {
            return this.stop();
        }

        this.moveCamera();

        game.canvas.draw();
    }

    prepareScene() {
        this.store.placePeople(this.player, this.mom)

        this.drawable.set({
            x: Math.round(game.canvas.width/2 - this.drawable.width/2),
            y: Math.round(game.canvas.height/2 - this.drawable.height/2),
            width: this.store.width * game.config.size.grid,
            height: this.store.height * game.config.size.grid
        });

        this.drawable.addChild(this.store.drawable)
        this.drawable.addChild(this.player)
        this.drawable.addChild(this.mom)

        return new Container()
            .set({
                width: game.canvas.width,
                height: game.canvas.height
            })
            .addChild(this.drawable);
    }

    detectCollisions() {
        let aisles = this.store.drawable.children

        aisles.forEach(aisle => {
            if (! aisle.collidable || ! this.player.intersects(aisle)) {
                return;
            }

            let cri = this.player.collisionResponseImpulse(aisle);

            this.player.x += cri.x
            this.player.y += cri.y
        });
    }

    moveCamera() {
        let absX = Math.round(this.player.absX)
        let absY = Math.round(this.player.absY)

        if (absX < game.cameraBoundry.left) {
            this.drawable.x += game.cameraBoundry.left - absX;
        } else if (absX > game.cameraBoundry.right) {
            this.drawable.x -= absX - game.cameraBoundry.right;
        }

        if (absY < game.cameraBoundry.top) {
            this.drawable.y += game.cameraBoundry.top - absY;
        } else if (absY > game.cameraBoundry.bottom) {
            this.drawable.y -= absY - game.cameraBoundry.bottom;
        }
    }
}
