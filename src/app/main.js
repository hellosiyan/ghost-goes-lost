import IO from './IO'
import Canvas from './Canvas'
import Loop from './Loop'
import {Scene, Rect} from './Drawables'

let a = new Canvas();
a.appendTo(document.body);


let scene = new Scene();
scene.width = a.width;
scene.height = a.height;

let rect = new Rect();
rect.addTo(scene);
rect.width = 20
rect.y = 50
rect.height = 20
rect.style.color = '#f0f'

a.setScene(scene);
a.draw();

let loop = new Loop();
loop.start(dt => {
	if (IO.left) {
		rect.x--
	} else if (IO.right) {
		rect.x++
	}

	if (IO.up) {
		rect.y--
	} else if (IO.down) {
		rect.y++
	}
	
	a.draw();
});
