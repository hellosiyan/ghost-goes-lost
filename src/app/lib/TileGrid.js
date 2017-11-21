export default class TileGrid {
    constructor () {
        this.data = [];
        this.width = 0;
        this.height = 0;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.fill(0, 0, width, height, 0);

        return this;
    }

    set(x, y, value) {
        this.data[this.width * y + x] = value;
    }

    get(x, y) {
        return this.data[this.width * y + x];
    }

    fill (xMin, yMin, xMax, yMax, value) {
        for (let x = xMin; x < xMax; x++) {
            for (let y = yMin; y < yMax; y++) {
                this.data[this.width * y + x] = value;
            }
        }
    }

    fillRow (row, value) {
        for (let x = 0; x < this.width; x++) {
            this.data[this.width * row + x] = value;
        }

        return this;
    }

    fillCol (col, value) {
        for (let y = 0; y < this.height; y++) {
            this.data[this.width * y + col] = value;
        }

        return this;
    }

    fillBorder(value) {
        this.fillRow(0, value)
            .fillRow(this.width - 1, value)
            .fillCol(0, value)
            .fillCol(this.height - 1, value);

        return this;
    }

    bucketFill(x, y, value) {
        let area = this.continuousSelect(x, y);

        this.fill(x, y, x + area.width, y + area.height, value);

        return this;
    }

    // TODO: Extend selection upwards and leftwards
    continuousSelect(x, y) {
        let targetValue = this.get(x, y);

        let area = {
            x,
            y,
            width: 0,
            height: 0,
        };

        while (this.get(x + area.width, y) === targetValue) {
            area.width++;
        }

        while (this.get(x, y + area.height) === targetValue) {
            area.height++;
        }

        return area;
    }

    toString () {
        let string = '';

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                string += (this.data[this.width * y + x]) + '\t';
            }

            string += '\n';
        }

        return string;
    }

    each(callback) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                callback(x, y, this.data[this.width * y + x]);
            }
        }
    }

    filter(value) {
        let filtered = [];

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.data[this.width * y + x] == value)
                    filtered.push({ x, y });
            }
        }

        return filtered;
    }

    overlayWith(tiles, destX, destY, value) {
        for (let x = 0; x < tiles.width; x++) {
            for (let y = 0; y < tiles.height; y++) {
                if (tiles.get(x, y)) {
                    this.data[this.width * (y + destY) + (x + destX)] = value;
                }
            }
        }
    }

    copy() {
        let copy = new TileGrid();

        copy.data = [...this.data];
        copy.width = this.width;
        copy.height = this.height;

        return copy;
    }

    static outsideRadius(coordinates, center, radius) {
        let result = [];
        let distance = 0;

        for (let i = 0; i < coordinates.length; i++) {
            distance = Math.abs(coordinates[i].x - center.x) + Math.abs(coordinates[i].y - center.y);
            if (distance > radius) {
                result.push(coordinates[i]);
            }
        }

        return result;
    }
}
