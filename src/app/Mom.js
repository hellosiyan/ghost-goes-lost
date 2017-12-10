import Container from './lib/Container';
import MotherGhost from './elements/MotherGhost';
import game from './Game';

export default class Mom extends Container {
    constructor() {
        super();

        this.visible = false;

        this.width = game.config.size.mom;
        this.height = Math.ceil(Math.ceil(game.config.size.mom / 20 * 26) * 0.1);

        this.ghost = new MotherGhost();
        this.addChild(this.ghost);
    }
}
