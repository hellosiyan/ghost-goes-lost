import Canvas from './Canvas'
import {Rect, Container} from './Drawables'
import Store from './Store'
import game from './Game'

game.init()

const store = new Store()

let cvs = new Canvas();

let scene = new Container().set({
    width: cvs.width,
    height: cvs.height
});

let storeMap = store.createDrawables()
let aisles = storeMap.children

let cont = new Container().set({
    x: 3,
    y: 3,
    width: store.width * game.config.size.grid,
    height: store.height * game.config.size.grid
}).setStyle({
    color: '#ccc',
    lineColor: '#f00',
    lineWidth: 2
});

cont.addChild(storeMap)
cont.addChild(game.player)

cont.addTo(scene);

cvs.setScene(scene);
cvs.appendTo(document.body);

// cvs.draw();

game.loop.start(dt => {
    game.player.move()

    for (var i = 0; i < aisles.length; i++) {
        if (game.player.intersects(aisles[i])) {
            let cri = game.player.collisionResponseImpulse(aisles[i]);
            game.player.x += cri.x
            game.player.y += cri.y
        }
    }

    cvs.draw();
});
