export const normalization = {
    linear(val, max) {
        return val / max;
    },

    log(val, max) {
        const logVal = Math.log(val + 1);
        const logMax = Math.log(max + 1);
        return logVal / logMax;
    },

    sqrt(val, max) {
        return Math.sqrt(val) / Math.sqrt(max);
    },
};


export function getHeatColor(score, max, normalizationFunction) {
    const t = normalizationFunction(score, max);
    
    // Map to HSL (red to green)
    const hue = t * 120;
    const saturation = 100;
    const lightness = 50 + 20 * (1 - t); // lighter for low scores

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}