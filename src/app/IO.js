class IO {
	constructor () {
		this.up = false
		this.down = false
		this.left = false
		this.right = false

		this.bindings = {
			up: [38,90,87],
			down: [40,83],
			left: [37,65,81],
			right: [39,68]
		}

		this.bindEvents()
	}

	updateKeyState (keyCode, state) {
		for(let prop in this.bindings) {
			if(this.bindings[prop].includes(keyCode)) {
				this[prop] = state
				return
			}
		}
	}

	bindEvents() {
		onkeydown = (e) => this.updateKeyState(e.keyCode, true)
		onkeyup = (e) => this.updateKeyState(e.keyCode, false)
		onblur = (e) => this.up = this.down = this.left = this.right = false
	}
}

let io = new IO()

export default io