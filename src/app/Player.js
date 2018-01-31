import Container from './lib/Container';
import Movable from './lib/Movable';
import ChildGhost from './elements/ChildGhost';
import game from './Game';
import { config } from './config';
import { inPixels } from './utils';

export default class Player extends Movable(Container) {
    constructor() {
        super();

        this.ghost = new ChildGhost();
        this.addChild(this.ghost);

        this.width = this.ghost.width;
        this.height = inPixels(3);

        this.ghost.alignWith(this.innerBox).bottomEdges();

        const ghostHoverHeight = inPixels(1);
        this.ghost.y -= ghostHoverHeight;
    }

    draw(ctx) {
        this.ghost.setDirection(this.direction);

        super.draw(ctx);
    }

    move(dt) {
        if (! (game.io.left || game.io.right || game.io.up || game.io.down)) {
            this.speed *= Math.pow(0.6, (dt * 60));
            this.speed = this.speed < 0.1 ? 0 : this.speed;
        } else {
            this.speed += config.speed.acceleration * dt;
            this.speed = Math.min(this.speed, config.speed.max);
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

        super.move(dt);
    }
}
