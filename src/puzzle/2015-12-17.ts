import { readInput } from '@/util/file-utils';

class Combination {
    constructor(public containers: number[]) {
    }

    get volume(): number {
        return this.containers.reduce((a, b) => a + b, 0);
    }
}

export default async function (puzzleKey): Promise<void> {
    const input = await readInput(puzzleKey);
    const containers = parseContainers(input);
    findCombinationCount(containers, 150);
}

function parseContainers(input: string): number[] {
    return input.split('\n')
        .map(l => l.trim())
        .map(l => parseInt(l, 10))
        .sort((a, b) => b - a);
}

function findCombinationCount(containers: number[], volume: number) {
    const combinations: Combination[] = [];

    const max = Math.pow(2, containers.length);
    for (let i = 0; i < max; i++) {
        const booleanArray = toBooleanArray(i, max);
        const combinationContainers = booleanArray
            .map((v, i) => v ? containers[i] : null)
            .filter(v => v !== null);
        const combination = new Combination(combinationContainers);
        if (combination.volume === volume) {
            combinations.push(combination);
        }
    }

    const combinationCount = combinations.length;
    console.log(`combination count: ${combinationCount}`);
    console.log(``);

    const minContainerCount = Math.min(...combinations.map(c => c.containers.length));
    console.log(`minimum containers: ${minContainerCount}`);

    const minContainerCombinations = combinations.filter(c => c.containers.length === minContainerCount);
    const minContainerCombinationCount = minContainerCombinations.length;
    console.log(`combination count (minimum containers): ${minContainerCombinationCount}`);
}

function toBooleanArray(num: number, max: number): boolean[] {
    const bitCount = Math.log(max) / Math.log(2);

    const arr = [];
    let rest = null, value = num;
    while(value > 0) {
        rest = value % 2;
        value = (value - rest) / 2;
        arr.push(rest === 1);
    }
    for (let i = arr.length; i < bitCount; i++) {
        arr.push(false);
    }
    return arr.reverse();
}
