import Container from './lib/Container';
import ChildGhost from './elements/ChildGhost';
import game from './Game';

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

        this.speed = {
            x: 0,
            y: 0,
        };
    }

    move() {
        if (! game.io.left && ! game.io.right) {
            this.speed.x = 0;
        } else {
            const newDirection = game.io.left ? 'left' : 'right';

            if (this.direction.x === newDirection) {
                this.speed.x += game.config.speed.acceleration * game.loop.dt;
            } else {
                this.speed.x = game.config.speed.initial * game.loop.dt;
            }

            this.speed.x = Math.min(this.speed.x, game.config.speed.max);

            this.direction.x = newDirection;

            if (this.direction.x == 'left') {
                this.x -= this.speed.x * game.loop.dt;
            } else {
                this.x += this.speed.x * game.loop.dt;
            }
        }

        if (! game.io.up && ! game.io.down) {
            this.speed.y = 0;
        } else {
            const newDirection = game.io.up ? 'up' : 'down';

            if (this.direction.y === newDirection) {
                this.speed.y += game.config.speed.acceleration * game.loop.dt;
            } else {
                this.speed.y = game.config.speed.initial * game.loop.dt;
            }

            this.speed.y = Math.min(this.speed.y, game.config.speed.max);

            this.direction.y = newDirection;

            if (this.direction.y == 'up') {
                this.y -= this.speed.y * game.loop.dt;
            } else {
                this.y += this.speed.y * game.loop.dt;
            }
        }

        this.ghost.direction = this.direction;
    }
}
