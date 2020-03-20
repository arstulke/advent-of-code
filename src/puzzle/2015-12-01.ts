import { readInput } from '@/util/file-utils';

export default async function (puzzleKey): Promise<void> {
    const input: string = await readInput(puzzleKey);
    let floor = 0;
    let enteredBasement = false;

    for (let i = 0; i < input.length; i++) {
        const inputChar = input[i];

        if (inputChar === '(') {
            floor++;
        } else if (inputChar === ')') {
            floor--;
        }

        if (!enteredBasement && floor < 0) {
            enteredBasement = true;
            console.log('first character that causes to enter the basement: ' + (i + 1));
        }
    }
    console.log('floor: '+ floor);
}