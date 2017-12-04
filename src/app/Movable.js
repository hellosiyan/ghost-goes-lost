import game from './Game';

const cos45 = 1 / Math.sqrt(2);

export default function Movable(baseClass) {
    console.log('movable!');

    if (! baseClass) {
        baseClass = class {};
    }

    class Movable extends baseClass {
        constructor() {
            super();

            this.direction = {
                x: '', // (left|right)
                y: '', // (up|down)
            };

            this.speed = 0;
        }

        move() {
            const movingDiagonally = (this.direction.x) && (this.direction.y);
            const speed = this.speed * game.loop.dt * (movingDiagonally ? cos45 : 1);

            if (this.direction.x == 'left') {
                this.x -= speed;
            } else if (this.direction.x == 'right') {
                this.x += speed;
            }

            if (this.direction.y == 'up') {
                this.y -= speed;
            } else if (this.direction.y == 'down') {
                this.y += speed;
            }
        }
    };

    return Movable;
}
