import Container from './lib/Container';
import ChildGhost from './elements/ChildGhost';
import Movable from './Movable';
import game from './Game';

export default class Player extends Movable(Container) {
    constructor() {
        super();

        this.visible = false;

        this.ghost = new ChildGhost();

        this.addChild(this.ghost);

        this.width = game.config.size.me;
        this.height = Math.ceil(Math.ceil(game.config.size.me / 20 * 26) * 0.1);
    }

    draw(ctx) {
        this.ghost.setDirection(this.direction);

        super.draw(ctx);
    }

    move() {
        if (! (game.io.left || game.io.right || game.io.up || game.io.down)) {
            this.speed *= Math.pow(0.6, (game.loop.dt * 60));
            this.speed = this.speed < 0.1 ? 0 : this.speed;
        } else {
            this.speed += game.config.speed.acceleration * game.loop.dt;
            this.speed = Math.min(this.speed, game.config.speed.max);
        }

        if (game.io.left) {
            this.direction.x = 'left';
        } else if (game.io.right) {
            this.direction.x = 'right';
        } else if (game.io.up || game.io.down) {
            this.direction.x = '';
        }

        if (game.io.up) {
            this.direction.y = 'up';
        } else if (game.io.down) {
            this.direction.y = 'down';
        } else if (game.io.left || game.io.right) {
            this.direction.y = '';
        }

        super.move();
    }
}
