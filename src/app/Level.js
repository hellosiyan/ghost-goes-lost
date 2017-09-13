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
            if (aisles[i].collidable && this.player.intersects(aisles[i])) {
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

        let absX = Math.round(this.player.absX)
        let absY = Math.round(this.player.absY)

        if (absX < game.cameraBoundry.left) {
            this.container.x += game.cameraBoundry.left - absX;
        } else if (absX > game.cameraBoundry.right) {
            this.container.x -= absX - game.cameraBoundry.right;
        }

        if (absY < game.cameraBoundry.top) {
            this.container.y += game.cameraBoundry.top - absY;
        } else if (absY > game.cameraBoundry.bottom) {
            this.container.y -= absY - game.cameraBoundry.bottom;
        }

        game.canvas.draw();
    }
}
