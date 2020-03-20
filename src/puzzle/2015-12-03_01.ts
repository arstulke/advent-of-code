import { readInput } from '@/util/file-utils';
import { countHouses, incrementPresentCount, move } from '@/puzzle/2015-12-03_lib';

export default async function(puzzleKey: string): Promise<void> {
    const inputKey = puzzleKey.substring(0, puzzleKey.length - 3);
    const input: string = await readInput(inputKey);

    const map = {};
    let coordinate = { x: 0, y: 0 };

    incrementPresentCount(map, coordinate);

    for (let i = 0; i < input.length; i++) {
        const direction = input[i];
        coordinate = move(coordinate, direction);
        incrementPresentCount(map, coordinate);
    }

    let houseCount = countHouses(map);
    console.log('houseCount: ' + houseCount);
}