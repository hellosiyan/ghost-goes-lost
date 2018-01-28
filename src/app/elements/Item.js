import Pixmap from '../Pixmap';

const colorKey = {
    // '.': '#0f0',
    '.': 'rgba(0,0,0,0)',
    0: '#000',
    1: '#111',
    2: '#222',
    3: '#333',
    4: '#444',
    5: '#555',
    6: '#666',
    7: '#777',
    8: '#888',
    9: '#999',
    a: '#aaa',
    b: '#bbb',
    c: '#ccc',
    d: '#ddd',
    e: '#eee',
    f: '#fff',
};

const pixmaps = {
    can: Pixmap.load(`
..666..
.6ccc6.
6bcccb6
46bbb64
4866684
4888884
4888884
48c8884
.48884.
..444..`, colorKey),
    bottle: Pixmap.load(`
..111..
..131..
..131..
.13321.
1333321
1373331
49a9994
4ff9f94
49a9994
1373331
1333221
.11111.`, colorKey),
};

export default class Item {
    static types() {
        return Object.entries(pixmaps).map(entry => ({
            name: entry[0],
            size: entry[1].getRenderSize()
        }));
    }

    static create(type) {
        return pixmaps[type].toDrawable();
    }
}
