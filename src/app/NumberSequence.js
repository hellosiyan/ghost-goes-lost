export default class NumberSequence {
	constructor(seed) {
			this.m_w  = seed;
			this.m_z  = 987654321 - seed;
			this.mask = 0xffffffff;

			this.next();
	}

	next () {
		this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
		this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;

		let result = ((this.m_z << 16) + this.m_w) & this.mask;
		result /= 4294967296;

		return result + 0.5;
	}

	pick (array) {
		let index = this.next() * array.length
		return array[index]
	}

	color() {
		return 'rgb(' + Math.floor(this.next()*256) + ',' + Math.floor(this.next()*256) + ',' + Math.floor(this.next()*256) + ')';
	}
}
