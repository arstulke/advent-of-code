import { readInput } from '@/util/file-utils';
import { getAllNumericCombinations } from "@/util/combination.util";

interface Pair {
    attendee: string;
    neighbour: string;
    happiness: number;
}

interface TableHappiness {
    order: string[];
    totalHappiness: number;
}

interface AttendeeHappiness {
    attendee: string;
    left: number;
    right: number;
}

const myself = 'Me';

export default async function (puzzleKey): Promise<void> {
    const input = await readInput(puzzleKey);
    getBestSeatingArrangement(input, false);
    getBestSeatingArrangement(input, true);
}

function getBestSeatingArrangement(input: string, includeMyself: boolean) {
    let pairs: Pair[] = parsePairs(input);
    if (includeMyself) {
        pairs = addMyselfToPairs(pairs);
    }

    const attendees: string[] = getAttendees(pairs);

    const combinations: string[][] = getAllCombinations(attendees);
    const tableHappinessArr: TableHappiness[] = calculateTableHappiness(pairs, attendees, combinations);

    const highestHappiness = tableHappinessArr
        .sort((a, b) => b.totalHappiness - a.totalHappiness)[0]
    const prepositionWord = includeMyself ? 'with' : 'without';
    console.log(`Arrangement with highest happiness is (${prepositionWord} me): ${highestHappiness.order.join(', ')}`);
    console.log(`Happiness units (${prepositionWord} me): ${highestHappiness.totalHappiness}`);
    console.log('');
}

function addMyselfToPairs(pairs: Pair[]) {
    const attendees: string[] = getAttendees(pairs);
    for (const attendee of attendees) {
        pairs.push({
            attendee: myself,
            neighbour: attendee,
            happiness: 0,
        });
        pairs.push({
            attendee: attendee,
            neighbour: myself,
            happiness: 0,
        });
    }
    return pairs;
}

function getAllCombinations(attendees: string[]): string[][] {
    return getAllNumericCombinations(attendees.length)
        .map(nc => nc.map(i => attendees[i]));
}

function calculateTableHappiness(
    pairs: Pair[],
    attendees: string[],
    combinations: string[][]
): TableHappiness[] {
    return combinations.map(c => ({
        order: c,
        totalHappiness: calculateHappiness(pairs, attendees, c),
    }));
}

function calculateHappiness(pairs: Pair[], attendees: string[], order: string[]) {
    const happiness = order.map(a => ({ attendee: a, left: null, right: null } as AttendeeHappiness));
    for (let i = 0; i < happiness.length; i++) {
        const attendeeHappiness = happiness[i];
        const leftNeighbour = happiness[(i - 1 + happiness.length) % happiness.length];
        const rightNeighbour = happiness[(i + 1 + happiness.length) % happiness.length];
        attendeeHappiness.left = findSingleHappiness(pairs, attendeeHappiness.attendee, leftNeighbour.attendee);
        attendeeHappiness.right = findSingleHappiness(pairs, attendeeHappiness.attendee, rightNeighbour.attendee);
    }

    return happiness
        .map(ah => ah.left + ah.right)
        .reduce((pv, cv) => pv + cv);
}

function findSingleHappiness(pairs: Pair[], attendee: string, neighbour: string): number {
    return pairs
        .find((p => p.attendee === attendee && p.neighbour === neighbour))
        .happiness;
}

function parsePairs(input: string): Pair[] {
    return input
        .split('\n')
        .map(l => l.trim().replace(/[.]*$/, '').split(' '))
        .map(l => ({attendee: l[0], neighbour: l[10], happiness: parseInt(l[3], 10) * (l[2] === 'lose' ? -1 : 1)} as Pair))
}

function getAttendees(pairs: Pair[]): string[] {
    return [...pairs.map(p => p.attendee), ...pairs.map(p => p.neighbour)]
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .sort((a, b) => a.localeCompare(b))
}
