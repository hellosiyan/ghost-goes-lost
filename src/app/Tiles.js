export default class Tiles {
    constructor () {
        this.data = []
        this.width = 0
        this.height = 0
    }

    resize(width, height) {
        this.width = width
        this.height = height
        this.fill(0,0, width, height, 0)
    }

    set(x, y, value) {
        this.data[this.width * y + x] = value
    }

    get(x, y) {
        return this.data[this.width * y + x]
    }

    fill (xMin, yMin, xMax, yMax, value) {
        for (let x = xMin; x < xMax; x++) {
            for (let y = yMin; y < yMax; y++) {
                this.data[this.width * y + x] = value
            }
        }
    }

    toString () {
        let string = '';

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                string += (this.data[this.width * y + x]) + '\t'
            }
            string += '\n'
        }

        return string
    }

    each(callback) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                callback(x, y, this.data[this.width * y + x]);
            }
        }
    }

    overlayWith(tiles, destX, destY, value) {
        for (let x = 0; x < tiles.width; x++) {
            for (let y = 0; y < tiles.height; y++) {
                if (tiles.get(x, y)) {
                    this.data[this.width * (y + destY) + (x + destX)] = value
                }
            }
        }
    }
}
