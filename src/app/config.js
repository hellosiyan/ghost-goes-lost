const gridSize = (ratio) => Math.round(70 * ratio);

export const config = {
    size: {
        grid: gridSize(1),
        me: gridSize(0.4),
    },
    speed: {
        initial: gridSize(0.14),
        max: gridSize(2.6),
        acceleration: gridSize(11.5),
    },
    shelf: {
        faceSize: gridSize(0.7),
        facePadding: gridSize(0.0429),
        minItemWidth: gridSize(0.4),
        sideSpacing: gridSize(0.14),
        shadowSize: gridSize(0.2),
    },
    palette: {
        base1: '#133354',
        base2: '#323251',
        high1: '#F6B18D',
        high2: '#DC657B',
        mid1: '#A86C7D',
    },
};
