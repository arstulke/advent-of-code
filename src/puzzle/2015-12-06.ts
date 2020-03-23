import { readInput } from '@/util/file-utils';

const regex = /(?<command>toggle|turn off|turn on) (?<coordinate1>([0-9]*),([0-9]*)) through (?<coordinate2>([0-9]*),([0-9]*))/;

type Command = 'toggle' | 'turn off' | 'turn on';

interface Coordinate {
    x: number;
    y: number;
}

interface Instruction {
    command: Command;
    coordinate1: Coordinate;
    coordinate2: Coordinate;
}

export default async function (puzzleKey): Promise<void> {
    const input = await readInput(puzzleKey);
    const instructions = input.split('\n');

    const grid = {};
    for (const instructionStr of instructions) {
        const instruction: Instruction = parseInstruction(instructionStr);
        executeInstructionRange(grid, instruction);
    }

    let totalBrightness = 0;
    for (let x = 0; x <= 999; x++) {
        const column = grid[x] || {};
        for (let y = 0; y <= 999; y++) {
            totalBrightness += (column[y] || 0);
        }
    }

    console.log('lights on: ' + totalBrightness);
}

function parseCommand(coordinateStr: string): Coordinate {
    const coordinates = coordinateStr.split(',');
    return {
        x: parseInt(coordinates[0], 10),
        y: parseInt(coordinates[1], 10),
    };
}

function parseInstruction(instructionStr: string): Instruction {
    const regexResult = regex.exec(instructionStr);
    const groups = regexResult.groups;
    return {
        command: groups.command as Command,
        coordinate1: parseCommand(groups.coordinate1),
        coordinate2: parseCommand(groups.coordinate2),
    };
}

function executeInstructionRange(grid: any, instruction: Instruction) {
    const c1 = instruction.coordinate1;
    const c2 = instruction.coordinate2;
    for (let x = c1.x; x <= c2.x; x++) {
        for (let y = c1.y; y <= c2.y; y++) {
            executeInstructionLight(grid, x, y, instruction.command);
        }
    }
}

function executeInstructionLight(grid: any, x: number, y: number, command: Command) {
    if (typeof grid[x] !== 'object') {
        grid[x] = {};
    }
    if (typeof grid[x][y] !== 'number') {
        grid[x][y] = 0;
    }


    if (command === 'toggle') {
        grid[x][y] += 2;
    } else if (command === 'turn on') {
        grid[x][y] += 1;
    } else if (command === 'turn off') {
        grid[x][y] -= 1;
    }
    grid[x][y] = Math.max(grid[x][y], 0);
}
