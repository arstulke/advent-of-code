import * as prompt from 'prompt';
import { PuzzleFunction } from './model/puzzle';

(async () => {
    const puzzleKey: string = await determinePuzzleKey();
    const puzzleFunc: PuzzleFunction = await importPuzzle(puzzleKey);
    await puzzleFunc(puzzleKey);
})();

async function determinePuzzleKey(): Promise<string> {
    const puzzleKeyFromArgs: string = process.argv[2];
    if (puzzleKeyFromArgs) {
        return puzzleKeyFromArgs;
    } else {
        prompt.start();
        return await new Promise((resolve) => {
            prompt.get(['puzzle'], (err, result) => resolve(result.puzzle));
        });
    }
}

async function importPuzzle(puzzleKey: string): Promise<PuzzleFunction> {
    const puzzleModule = await import('@/puzzle/' + puzzleKey);
    return puzzleModule.default as PuzzleFunction;
}