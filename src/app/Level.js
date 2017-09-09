import BaseObject from './BaseObject'
import {Container} from './Drawables'
import Player from './Player'
import Mom from './Mom'
import Store from './Store'
import game from './Game'

export default class Level extends BaseObject {
    constructor(difficulty) {
        super()

        this.difficulty = difficulty

        this.scene = new Container().set({
            width: game.canvas.width,
            height: game.canvas.height
        });

        this.store = new Store(difficulty)
        this.player = new Player()
        this.mom = new Mom()

        this.container = new Container()
            .set({
                width: this.store.width * game.config.size.grid,
                height: this.store.height * game.config.size.grid
            })
            .setStyle({
                color: '#ccc',
                lineColor: '#f00',
                lineWidth: 2
            });

        this.store.placePeople(this.player, this.mom)

        this.container.set({
            x: Math.round(game.canvas.width/2 - this.container.width/2),
            y: Math.round(game.canvas.height/2 - this.container.height/2),
        });

        this.container.addChild(this.store.drawable)
        this.container.addChild(this.player)
        this.container.addChild(this.mom)

        this.container.addTo(this.scene)
    }

    loopHandler(dt) {
        this.player.move()

        let aisles = this.store.drawable.children
        for (var i = 0; i < aisles.length; i++) {
            if (this.player.intersects(aisles[i])) {
                let cri = this.player.collisionResponseImpulse(aisles[i]);
                this.player.x += cri.x
                this.player.y += cri.y
            }
        }

        if (this.player.intersects(this.mom)) {
            game.canvas.draw();
            this.onLevelEnd();
            return;
        }

        if (this.player.absX < game.cameraBoundry.left) {
            this.container.x += game.cameraBoundry.left - this.player.absX;
        } else if (this.player.absX > game.cameraBoundry.right) {
            this.container.x -= this.player.absX - game.cameraBoundry.right;
        }

        if (this.player.absY < game.cameraBoundry.top) {
            this.container.y += game.cameraBoundry.top - this.player.absY;
        } else if (this.player.absY > game.cameraBoundry.bottom) {
            this.container.y -= this.player.absY - game.cameraBoundry.bottom;
        }

        game.canvas.draw();
    }
}
