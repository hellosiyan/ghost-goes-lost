import IO from './IO'
import Canvas from './Canvas'
import Loop from './Loop'
import {Scene, Rect, Container} from './Drawables'
import NumberSequence from './NumberSequence'
import Obstacle from './Obstacle'

const prng = new NumberSequence(2)

let a = new Canvas();
a.appendTo(document.body);

let scene = new Scene();
scene.width = a.width;
scene.height = a.height;

let cont = new Container();
cont.addTo(scene);
cont.x = 100
cont.y = 100
cont.width = 200
cont.height = 200

let me = new Rect();
me.addTo(cont);
me.set({
	width: 30,
	height: 30,
	x: 20,
	y: 20
})
me.style.color = '#f0f';

let aisle = (new Obstacle()).set({
	width: 10,
	height: 10,
	x: 0,
	y: -30
});
aisle.style.color = '#4e4'
aisle.addTo(cont);

a.setScene(scene);
a.draw();

let loop = new Loop();
loop.stats(true);

loop.start(dt => {
	if (IO.left) {
		me.x-= 1
	} else if (IO.right) {
		me.x+= 1
	}

	if (IO.up) {
		me.y-= 1
	} else if (IO.down) {
		me.y+= 1
	}

	if (me.intersects(aisle)) {
		let cri = me.collisionResponseImpulse(aisle);
		me.x += cri.x
		me.y += cri.y
	}
	
	a.draw();
});
