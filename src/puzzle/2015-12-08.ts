import { readInput } from '@/util/file-utils';

interface LineStats {
    charsOfCode: number;
    charsInMemory: number;
    charsOfEncoded: number;
}

function calculateCharsInMemory(line: string): number {
    const transformedLine = line
        .replace(/^"/, '')
        .replace(/"$/, '');

    let charsInMemory = 0;
    for (let i = 0; i < transformedLine.length; i++) {
        const ch1 = transformedLine[i];
        const ch2 = transformedLine[i + 1];
        const escapedBackslash = ch1 === '\\' && ch2 === '\\';
        const escapedDoubleQuote = ch1 === '\\' && ch2 === '"';
        const escapedHexChar = ch1 === '\\' && ch2 === 'x';
        if (escapedBackslash || escapedDoubleQuote) {
            i++;
        } else if (escapedHexChar) {
            i += 3;
        }
        charsInMemory++;
    }
    return charsInMemory;
}

function calculateCharsOfEncoded(line: string): number {
    let charsOfEncoded = 2;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '\\' || ch === '"') {
            charsOfEncoded++;
        }
        charsOfEncoded++;
    }
    return charsOfEncoded;
}

function calculateLineStats(line: string): LineStats {
    line = line.trim();
    const charsOfCode = line.length;
    const charsInMemory = calculateCharsInMemory(line);
    const charsOfEncoded = calculateCharsOfEncoded(line);
    return { charsOfCode, charsInMemory, charsOfEncoded };
}

export default async function (puzzleKey): Promise<void> {
    const input = await readInput(puzzleKey);

    const totalLineStats: LineStats = input
        .split('\n')
        .map(line => calculateLineStats(line))
        .reduce((v1: LineStats, v2: LineStats) => {
            v1.charsOfCode += v2.charsOfCode;
            v1.charsInMemory += v2.charsInMemory;
            v1.charsOfEncoded += v2.charsOfEncoded;
            return v1;
        });

    console.log('charDifference #1: ' + (totalLineStats.charsOfCode - totalLineStats.charsInMemory));
    console.log('charDifference #2: ' + (totalLineStats.charsOfEncoded - totalLineStats.charsOfCode));
}