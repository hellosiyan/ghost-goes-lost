import IO from './IO'
import Canvas from './Canvas'
import Loop from './Loop'
import {Scene, Rect, Container} from './Drawables'
import NumberSequence from './NumberSequence'
import Obstacle from './Obstacle'

const prng = new NumberSequence(2)

const speed = {
	move: 80
}

const size = {
	grid: 40,
	me: 20
}

let cvs = new Canvas();
cvs.appendTo(document.body);

let scene = new Scene();
scene.width = cvs.width;
scene.height = cvs.height;

cvs.setScene(scene);

let cont = new Container().set({
	x: size.grid,
	y: size.grid,
	width: size.grid * 8,
	height: size.grid * 8
});
cont.addTo(scene);

let me = new Rect().set({
	width: size.me,
	height: size.me,
	x: size.grid,
	y: size.grid
});
me.style.color = '#f0f';
me.addTo(cont);

let map = [
	[1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,1],
	[1,0,1,0,1,0,0,1],
	[1,0,1,0,0,1,0,1],
	[1,0,0,0,0,0,0,1],
	[1,1,1,0,0,1,1,1],
	[1,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1],
];

let aisles = [];

for (let x = 0; x < map.length; x++) {
	for (let y = 0; y < map.length; y++) {
		if (!map[y][x]) continue

		let aisle = new Obstacle().set({
			width: size.grid,
			height: size.grid,
			x: size.grid * x,
			y: size.grid * y
		});
		aisle.style.color = '#4e4'
		aisle.addTo(cont);

		aisles.push(aisle)
	}
}

let loop = new Loop();
loop.stats(true);

loop.start(dt => {
	if (IO.left) {
		me.x-= speed.move * dt
	} else if (IO.right) {
		me.x+= speed.move * dt
	}

	if (IO.up) {
		me.y-= speed.move * dt
	} else if (IO.down) {
		me.y+= speed.move * dt
	}

	for (var i = 0; i < aisles.length; i++) {
		if (me.intersects(aisles[i])) {
			let cri = me.collisionResponseImpulse(aisles[i]);
			me.x += cri.x
			me.y += cri.y
		}
	}
	
	cvs.draw();
});
