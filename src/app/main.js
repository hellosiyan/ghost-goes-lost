import IO from './IO'
import Canvas from './Canvas'
import Loop from './Loop'
import {Scene, Rect, Container} from './Drawables'
import NumberSequence from './NumberSequence'
import Obstacle from './Obstacle'
import Store from './Store'

import {config} from './config'

const store = new Store()

let cvs = new Canvas();
cvs.appendTo(document.body);

let scene = new Scene();
scene.width = cvs.width;
scene.height = cvs.height;

cvs.setScene(scene);

let cont = new Container().set({
	x: 0,
	y: 0,
	width: config.size.grid * 8,
	height: config.size.grid * 8
});
cont.addTo(scene);
cont.style.color = '#000';

let me = new Rect().set({
	width: config.size.me,
	height: config.size.me,
	x: config.size.grid,
	y: config.size.grid
});
me.style.color = '#f0f';
me.addTo(cont);

let mapSize = {x: 8, y: 8}
let map = store.generateMap()
map.aisles.forEach(aisle => aisle.addTo(cont))

cont.set({
	width: map.size.x * config.size.grid*1.1,
	height: map.size.y * config.size.grid*1.1
});

let loop = new Loop();
loop.stats(true);

cvs.draw();
/*
loop.start(dt => {
	if (IO.left) {
		me.x-= config.speed.move * dt
	} else if (IO.right) {
		me.x+= config.speed.move * dt
	}

	if (IO.up) {
		me.y-= config.speed.move * dt
	} else if (IO.down) {
		me.y+= config.speed.move * dt
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
*/