import { readInput } from '@/util/file-utils';
import { countHouses, incrementPresentCount, move } from '@/puzzle/2015-12-03_lib';

export default async function(puzzleKey: string): Promise<void> {
    const inputKey = puzzleKey.substring(0, puzzleKey.length - 3);
    const input: string = await readInput(inputKey);

    const map = {};
    let santaCoordinate = { x: 0, y: 0 };
    let roboSantaCoordinate = { x: 0, y: 0 };

    incrementPresentCount(map, santaCoordinate);
    incrementPresentCount(map, roboSantaCoordinate);

    for (let i = 0; i < input.length; i++) {
        const direction = input[i];
        const humanSantasTurn = i % 2 == 0;

        let coordinate = humanSantasTurn ? santaCoordinate : roboSantaCoordinate;
        coordinate = move(coordinate, direction);
        if (humanSantasTurn) {
            santaCoordinate = coordinate;
        } else {
            roboSantaCoordinate = coordinate;
        }

        incrementPresentCount(map, coordinate);
    }

    let houseCount = countHouses(map);
    console.log('houseCount: ' + houseCount);
}