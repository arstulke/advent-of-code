import { readInput } from '@/util/file-utils';

interface Reindeer {
    name: string;
    topSpeed: number;
    stamina: number;
    rest: number;
}

export default async function (puzzleKey): Promise<void> {
    const inputKey = puzzleKey.substring(0, puzzleKey.length - 3);
    const input = await readInput(inputKey);
    const winnerDistance = raceReindeers(input, 2503);
}

function raceReindeers(input: string, seconds: number): number {
    const reindeers: Reindeer[] = parseReindeers(input);
    const winner = reindeers
        .map(reindeer => ({ reindeer, distance: calculateDistance(reindeer, seconds) }))
        .reduce((pv, cv) => pv.distance > cv.distance ? pv: cv);

    console.log('winner: ' + winner.reindeer.name);
    console.log('winner distance: ' + winner.distance);
    return winner.distance;
}

function calculateDistance(reindeer: Reindeer, seconds: number): number {
    const fullCycleDuration = reindeer.stamina + reindeer.rest;
    const fullCycleCount = Math.floor(seconds / fullCycleDuration);

    const remainingSeconds = seconds % fullCycleDuration;
    const lastCycleFlyingTime = Math.min(reindeer.stamina, remainingSeconds);

    const flyingTime = fullCycleCount * reindeer.stamina + lastCycleFlyingTime;
    const distance = flyingTime * reindeer.topSpeed;
    return distance;
}

function parseReindeers(input: string): Reindeer[] {
    return input
        .split('\n')
        .map(l => l.trim().split(' '))
        .map(l => ({
            name: l[0],
            topSpeed: parseInt(l[3], 10),
            stamina: parseInt(l[6], 10),
            rest: parseInt(l[13], 10),
        }));
}
