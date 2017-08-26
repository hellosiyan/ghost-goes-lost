import Canvas from './Canvas'
import {Rect, Container} from './Drawables'
import Store from './Store'
import game from './Game'

game.init()

const store = new Store()

let cvs = new Canvas();
cvs.appendTo(document.body);

let scene = new Container();
scene.width = cvs.width;
scene.height = cvs.height;

cvs.setScene(scene);

let cont = new Container().set({
    x: 0,
    y: 0,
    width: game.config.size.grid * 8,
    height: game.config.size.grid * 8
});
cont.addTo(scene);
cont.style.color = '#000';

game.player.addTo(cont);

let map = store.generateMap()
map.aisles.forEach(aisle => aisle.addTo(cont))

cont.set({
    width: store.width * game.config.size.grid,
    height: store.height * game.config.size.grid
});

cvs.draw();
/*
game.loop.start(dt => {
    game.player.move()

    // for (var i = 0; i < map.aisles.length; i++) {
    //     if (me.intersects(map.aisles[i])) {
    //         let cri = me.collisionResponseImpulse(map.aisles[i]);
    //         me.x += cri.x
    //         me.y += cri.y
    //     }
    // }

    cvs.draw();
});
*/
