const pixelSize = 3;

export const config = {
    size: {
        pixel: pixelSize,
        gridPixels: 30 * pixelSize,
        aisleHeight: 36 * pixelSize,
    },
    speed: {
        initial: 7 * pixelSize,
        max: 200 * pixelSize,
        acceleration: 550 * pixelSize,
    },
    palette: {
        base1: '#133354',
        base2: '#323251',
        high1: '#F6B18D',
        high2: '#DC657B',
        mid1: '#A86C7D',
    },
    colors: {
        aisle: {
            shelf: '#6A628E',
            edges: '#463E60',
        }
    }
};
