export function percentOf(percent: number, value: number) {
    return (percent / 100) * value;
}

export function randomBetween(min: number, max: number) {
    return (Math.random() * (max - min)) + min;
}