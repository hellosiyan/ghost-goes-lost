import Canvas from './Canvas'
import {Rect, Container} from './Drawables'
import Store from './Store'
import game from './Game'

game.init()

let store = new Store()
store.createDrawables()
store.placePeople()

let cvs = new Canvas();

let scene = new Container().set({
    width: cvs.width,
    height: cvs.height
});

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

cont.addChild(store.drawables)
cont.addChild(game.player)
cont.addChild(game.mom)

cont.addTo(scene);

cvs.setScene(scene);
cvs.appendTo(document.body);

// cvs.draw();

game.loop.start(dt => {
    game.player.move()

    let aisles = store.drawables.children
    for (var i = 0; i < aisles.length; i++) {
        if (game.player.intersects(aisles[i])) {
            let cri = game.player.collisionResponseImpulse(aisles[i]);
            game.player.x += cri.x
            game.player.y += cri.y
        }
    }

    if (game.player.intersects(game.mom)) {
        game.loop.stop()
        alert('Yey :>');
        return
    }

    cvs.draw();
});

