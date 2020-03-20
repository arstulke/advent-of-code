import * as fs from 'fs';
import * as path from 'path';

export async function readInput(inputKey: string): Promise<string> {
    return await new Promise((resolve) => {
        const filename = path.resolve('src/input', inputKey + '.txt');
        fs.readFile(filename, (err, data: Buffer) => {
            const content: string = data.toString('utf8');
            resolve(content);
        });
    });
}