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
    width: store.width * game.config.size.grid,
    height: store.height * game.config.size.grid
}).setStyle({
    color: '#ccc',
    lineColor: '#f00',
    lineWidth: 2
});

cont.set({
    x: Math.round(cvs.width/2 - cont.width/2),
    y: Math.round(cvs.height/2 - cont.height/2)
})

cont.addChild(store.drawables)
cont.addChild(game.player)
cont.addChild(game.mom)

cont.addTo(scene);

cvs.setScene(scene);
cvs.appendTo(document.body);

// cvs.draw();

let cameraBoundry = {
    left: Math.round(cvs.width * 0.35),
    bottom: cvs.height - Math.round(cvs.height * 0.35),
    right: cvs.width - Math.round(cvs.width * 0.35),
    top: Math.round(cvs.height * 0.35)
}

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

    let absX = Math.round(cont.x + game.player.x)
    let absY = Math.round(cont.y + game.player.y)

    if (absX < cameraBoundry.left) {
        cont.x += cameraBoundry.left - absX;
    } else if (absX > cameraBoundry.right) {
        cont.x -= realX - cameraBoundry.right;
    }

    if (absY < cameraBoundry.top) {
        cont.y += cameraBoundry.top - absY;
    } else if (absY > cameraBoundry.bottom) {
        cont.y -= absY - cameraBoundry.bottom;
    }

    cvs.draw();
});
