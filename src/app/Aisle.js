import Container from './lib/Container';
import Collidable from './Collidable';
import Shelf from './Shelf';
import { config } from './config';
import { inPixels } from './utils';

export default class Aisle extends Collidable(Container) {
    assemble() {
        const shelfSpacing = inPixels(12);

        for (var chelfIndex = 0; chelfIndex < 3; chelfIndex++) {
            const shelf = new Shelf();

            shelf.set({
                    x: 0,
                    y: this.height - shelf.height - shelfSpacing * chelfIndex,
                    width: this.width,
                })
                .setStyle({
                    color: '#' + (chelfIndex * 2 + 1).toString().repeat(3),
                })
                .assemble();

            this.addChild(shelf);
        }

        this.cache();

        return this;
    }
}
