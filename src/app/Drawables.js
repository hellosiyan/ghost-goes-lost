export {Style, Point, Drawble, Circle, Rect, Container, Scene};

class Style {
	constructor () {
		this.color = '#999'; // Polygons, Points
		this.lineColor = '#999'; // Polygons, Points
		this.lineWidth = 1; // Polygons, Points
		this.fillType = 'stroke'; // Polygons, Points
		this.skeleton = false; // Polygons
		this.radius = 3; // Points
		this.opacity = 1; // Polygons, Points
	}
}

class Point {
	constructor () {
		this.x = 0;
		this.y = 0;
		this.style = new Style();
		this.visible = true;
	}

	draw () {
		ctx.beginPath();
		ctx.fillStyle = this.style.color;
		ctx.arc(this.x, this.y, this.style.radius, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
	}
}

class Drawable {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = 1;
		this.height = 1;
		this.visible = true;
		this.style = new Style();
	}

	draw(){}

	containsPoint (point) {
		if(point.x < this.x && point || point.y < this.y ) {
			return false;
		} else {
			return point.x <= this.x+this.height  && this.y <= this.y+this.height;
		}
	}

	intersects (target) {
		var minY = Math.min(this.y, this.y + this.height, target.y, target.y + target.height);
		var maxY = Math.max(this.y, this.y + this.height, target.y, target.y + target.height);
		
		// Check Y
		if ( this.height + target.height >= Math.abs(maxY - minY)) {
			// Check X
			var minX = Math.min(this.x, this.x + this.width, target.x, target.x + target.width);
			var maxX = Math.max(this.x, this.x + this.width, target.x, target.x + target.width);
			if( this.width + target.width >= Math.abs(maxX-minX) ) {
				return true;
			}
		}
		
		return false;
	}
	
	addTo (...containers) {
		containers.forEach(container => container.addChild(this));
	}
}

class Circle extends Drawable {
	draw (ctx) {
		ctx.fillStyle = this.style.color;
		ctx.globalAlpha = this.style.opacity;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.style.radius, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
		return this;
	}
}

class Rect extends Drawable{
	constructor(...args) {
		super(...args);
	}

	draw (ctx) {
		ctx.fillStyle = this.style.color;
		ctx.globalAlpha = this.style.opacity;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		return this;
	}
}

class Container extends Rect {
	constructor(...args) {
		super(...args)

		this.children = [];
	}

	addChild (child) {
		if(this.children.indexOf(child) >= 0) return;
		this.children.push(child);
	}

	removeChild (child) {
		var ind = this.children.indexOf(child);
		if (ind < 0) return false;
		this.children.splice(ind, 1);
		return true;
	}
}

class Scene extends Container {
	constructor (...args) {
		super(...args)

		this.name = 'scene0';
		this.fps = 20;
	}
}