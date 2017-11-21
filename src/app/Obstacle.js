import Container from './lib/Container';

export default class Obstacle extends Container {
    constructor() {
        super();

        this.collidable = true;
    }
}
