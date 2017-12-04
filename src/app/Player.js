import Container from './lib/Container';
import ChildGhost from './elements/ChildGhost';
import game from './Game';

const cos45 = 1 / Math.sqrt(2);

export default class Player extends Container {
    constructor() {
        super();

        this.visible = false;

        this.direction = {
            x: '', // (left|right)
            y: '', // (up|down)
        };

        this.ghost = new ChildGhost();

        this.addChild(this.ghost);

        this.width = game.config.size.me;
        this.height = Math.ceil(Math.ceil(game.config.size.me / 20 * 26) * 0.1);

        this.speed = 0;
    }

    move() {
        if (! (game.io.left || game.io.right || game.io.up || game.io.down)) {
            this.speed = 0;
            return;
        }

        this.speed += game.config.speed.acceleration * game.loop.dt;
        this.speed = Math.min(this.speed, game.config.speed.max);

        const movingDiagonally = (game.io.left || game.io.right) && (game.io.up || game.io.down);
        const speed = this.speed * game.loop.dt * (movingDiagonally ? cos45 : 1);

        if (game.io.left) {
            this.x -= speed;
            this.direction.x = 'left';
        } else if (game.io.right) {
            this.x += speed;
            this.direction.x = 'right';
        }

        if (game.io.up) {
            this.y -= speed;
            this.direction.y = 'up';
        } else if (game.io.down) {
            this.y += speed;
            this.direction.y = 'down';
        }

        this.ghost.direction = this.direction;
    }
}
