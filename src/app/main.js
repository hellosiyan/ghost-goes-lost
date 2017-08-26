import IO from './IO'
import Canvas from './Canvas'
import Loop from './Loop'
import {Rect, Container} from './Drawables'
import NumberSequence from './NumberSequence'
import Obstacle from './Obstacle'
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

let me = new Rect().set({
    width: game.config.size.me,
    height: game.config.size.me,
    x: game.config.size.grid,
    y: game.config.size.grid
});
me.style.color = '#f0f';
me.addTo(cont);

let mapSize = {x: 8, y: 8}
let map = store.generateMap()
map.aisles.forEach(aisle => aisle.addTo(cont))

cont.set({
    width: map.size.x * game.config.size.grid,
    height: map.size.y * game.config.size.grid
});

let loop = new Loop();
loop.stats(true);

// cvs.draw();

loop.start(dt => {
    if (IO.left) {
        me.x-= game.config.speed.move * dt
    } else if (IO.right) {
        me.x+= game.config.speed.move * dt
    }

    if (IO.up) {
        me.y-= game.config.speed.move * dt
    } else if (IO.down) {
        me.y+= game.config.speed.move * dt
    }

    for (var i = 0; i < map.aisles.length; i++) {
        if (me.intersects(map.aisles[i])) {
            let cri = me.collisionResponseImpulse(map.aisles[i]);
            me.x += cri.x
            me.y += cri.y
        }
    }

    cvs.draw();
});
