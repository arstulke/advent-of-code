import { readInput } from '@/util/file-utils';

export type NiceDeciderFunc = (str: string) => boolean;

export async function countNiceMessages(puzzleKey: string, niceDeciderFunc: NiceDeciderFunc): Promise<void> {
    const input: string = await readInput(puzzleKey.substring(0, puzzleKey.length - 3));
    const messages = input.split('\n');

    let niceMessageCount = 0;
    for (const message of messages) {
        if (niceDeciderFunc(message)) {
            niceMessageCount++;
        }
    }

    console.log('nice messages: ' + niceMessageCount);
}