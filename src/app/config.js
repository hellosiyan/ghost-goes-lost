const gridSizeFloat = (ratio) => 140 * ratio;
const gridSizeInt = (ratio) => Math.round(gridSizeFloat(ratio));

export const config = {
    size: {
        pixel: 3,
        grid: gridSizeInt(1),
        me: gridSizeInt(0.6),
        mom: gridSizeInt(0.45),
    },
    speed: {
        initial: gridSizeInt(0.14),
        max: gridSizeInt(4),
        acceleration: gridSizeInt(11.5),
    },
    shelf: {
        faceSize: gridSizeInt(0.7),
        facePadding: gridSizeInt(0.0429),
        sideSpacing: gridSizeInt(0.07),
        shadowSize: gridSizeInt(0.2),
        itemScaleRatio: gridSizeFloat(0.015),
    },
    palette: {
        base1: '#133354',
        base2: '#323251',
        high1: '#F6B18D',
        high2: '#DC657B',
        mid1: '#A86C7D',
    },
};
