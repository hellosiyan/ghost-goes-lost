import NumberSequence from './NumberSequence'
import Obstacle from './Obstacle'
import Obj from './Obj'
import {config} from './config'

// let prng = new NumberSequence(90)
let prng = new NumberSequence(Math.round(Math.random()*10000))

export default class Store {
	constructor() {
		this.aisles = []
		this.difficulty = 5
	}

	generateMap () {
		let size = {
			x: 10 + this.difficulty * 2,
			y: 10 + this.difficulty * 2
		}

		let rooms = [new Room().set({
			x: 0, y: 0, 
			w: size.x, h: size.y, 
			color: prng.color()
		})];

		let hasNewRooms = true

		while (hasNewRooms) {
			hasNewRooms = false
			for (var i = 0; i < rooms.length; i++) {
				let newRoom = rooms[i].divide(prng)

				if (!newRoom) continue;

				hasNewRooms = true
				rooms.push(newRoom)
			}
		}

		let aisles = []
		rooms.forEach(room => aisles = aisles.concat(room.getAisles()))

		return {
			aisles: aisles,
			size: size
		}
	}
}

class Room extends Obj {
	constructor() {
		super()

		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;
		this.color = '#dad'
	}

	get size() {
		return this.w * this.h
	}

	get xMax () {
		return this.x + this.w
	}

	get yMax () {
		return this.y + this.h
	}

	getAisles () {
		this.aisles = []

		let vertical = this.w > this.h
		let padding = Math.round(prng.next())
		let step = Math.round(prng.next()) + 2

		// Remove random padding for odd lengths 
		if ( vertical && ((this.w%2) == 1) ) {
			padding = 0;
		} else if ( ! vertical && ((this.h%2) == 1) ) {
			padding = 0;
		}

		for (let x = this.x; x < this.xMax; x++) {
			for (let y = this.y; y < this.yMax; y++) {
				let draw = vertical ? (this.xMax - x + padding) % step: (this.yMax - y + padding) % step;

				if (draw) {
					this.aisles.push(this.createAisle(x, y))
				}/* else {
					this.aisles.push(this.createPassage(x, y))
				}*/
			}
		}

		return this.aisles
	}

	createAisle(x, y) {
		let aisle = new Obstacle().set({
			width: config.size.grid,
			height: config.size.grid,
			x: config.size.grid * x * 1.1,
			y: config.size.grid * y * 1.1
		});
		aisle.style.color = this.color
		aisle.style.opacity = 0.9

		return aisle
	}


	createPassage(x, y) {
		let aisle = new Obstacle().set({
			width: config.size.grid,
			height: config.size.grid,
			x: config.size.grid * x * 1.1,
			y: config.size.grid * y * 1.1
		});
		aisle.style.color = '#333'
		aisle.style.opacity = 0.6

		return aisle
	}


	divide (prng) {
		if ( this.size < 24 ) return false;

		let props = this.w > this.h ? ['x', 'w']: ['y', 'h'];
		let cut = Math.round(this[props[1]] * (0.5 + (prng.next()-0.5) * 0.2))

		let sibling = new Room().set({
			x: this.x,
			y: this.y,
			w: this.w,
			h: this.h
		})

		sibling.color = prng.color();
		sibling[props[0]] += cut
		sibling[props[1]] -= cut

		this[props[1]] = cut - 1;

		return sibling
	}
}