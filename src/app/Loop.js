export default class Loop {

	constructor() {
		this.lastTime = this.timestamp();
		this.worker = () => {};
	}

	start (fn) {
		this.worker = fn;

		return this.raf();
	};

	tick(dt) {
		this.worker(dt);
		this.raf();
	}

	timestamp () {
		return window.performance.now();
	}

	raf () {
		return window.requestAnimationFrame(() => {
			let now = this.timestamp();
			let dt = now - this.lastTime;
	
			if (dt > 999) {
				dt = 1 / 60;
			} else {
				dt /= 1000;
			}
	
			this.lastTime = now;
	
			this.tick(dt);
		});
	}
}