import * as fs from 'fs';
import * as path from 'path';

export async function readInput(inputKey: string, fileExtension: string = 'txt'): Promise<string> {
    const filename = path.resolve('src/input', inputKey + '.' + fileExtension);
    return await new Promise((resolve) => {
        fs.readFile(filename, (err, data: Buffer) => {
            resolve(data.toString('utf8'));
        });
    });
}