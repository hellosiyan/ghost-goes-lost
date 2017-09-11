import {Container} from './Drawables'

export default class Obstacle extends Container {
    constructor() {
        super()

        this.collidable = true;
    }
}
