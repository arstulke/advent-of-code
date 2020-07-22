import { readInput } from '@/util/file-utils';

const instructionRegex = /(?<input>.+) -> (?<output>\w+)/;
const oneParamOperationRegex = /^(NOT )?(?<input1>[a-z0-9]+)$/;
const twoParamOperationRegex = /^(?<input1>[a-z0-9]+) (?<operator>AND|OR|LSHIFT|RSHIFT) (?<input2>[a-z0-9]+)$/;

type TwoParamOperator = 'AND' | 'OR';
type ValueProvider = (valueExpr: string) => number;
type ValueFunc = (valueProvider: ValueProvider) => number;
type CombinationFunc = (value1: number, value2: number) => number;

interface Wire {
    inputs: string[];
    value: ValueFunc;
    output: string;
}

export default async function (puzzleKey): Promise<void> {
    const input = await readInput(puzzleKey);
    const wires = input.split('\n');


    let valueStore: any = {};
    const valueProvider: ValueProvider =
        (valueExpr: string) => valueStore[valueExpr] || parseInt(valueExpr, 10);

    const wireStore = {};
    for (const wireStr of wires) {
        const wire: Wire = parseWire(wireStr);
        for (let input of wire.inputs) {
            wireStore[input] = wireStore[input] || [];
            wireStore[input].push(wire);
        }
    }

    // #1
    calculateWireValues(valueStore, wireStore, valueProvider);
    const result1 = valueStore['a'];
    console.log('\nPart 1\na: ' + result1 + '\n');

    // #2
    valueStore = { b: result1 }; // reset valueStore and set override wire b to old value of wire a
    calculateWireValues(valueStore, wireStore, valueProvider);
    const result2 = valueStore['a'];
    console.log('Part 2\na: ' + result2 + '\n');
}

function calculateWireValues(
    valueStore: any,
    wireStore: any,
    valueProvider: ValueProvider) {

    for (const input in wireStore) {
        const isNumber = input.match(/^[0-9]+$/);
        if (isNumber) {
            valueStore[input] = parseInt(input, 10);
        }
    }

    let newValues: string[] = Object.keys(valueStore);
    while (newValues.length > 0) {
        for (const input of newValues) {
            const wires: Wire[] = wireStore[input] || [];
            let calculatedNewValue = false;
            for (const wire of wires) {
                const allValuesAvailable = wire.inputs
                        .filter(input => typeof valueStore[input] === 'number')
                        .length
                    === wire.inputs.length;
                const isValuePresent = typeof valueStore[wire.output] === 'number';
                if (allValuesAvailable && !isValuePresent) {
                    valueStore[wire.output] = wire.value(valueProvider);
                    calculatedNewValue = true;
                    newValues.push(wire.output);
                }
            }
            if (!calculatedNewValue) {
                const index = newValues.indexOf(input);
                newValues.splice(index, 1);
            }
        }
    }
}

function parseWire(wireStr: string): Wire {
    const regexResult = instructionRegex.exec(wireStr);

    const wire: Wire = buildWire(regexResult.groups.input);
    wire.output = regexResult.groups.output;

    return wire;
}

function getCombinationFunc(operator: TwoParamOperator): CombinationFunc {
    if (operator === 'AND') {
        return (v1, v2) => v1 & v2;
    } else if (operator === 'OR') {
        return (v1, v2) => v1 | v2;
    } else if (operator === 'LSHIFT') {
        return (v1, v2) => v1 << v2;
    } else if (operator === 'RSHIFT') {
        return (v1, v2) => v1 >> v2;
    }
    throw 'unknown operator';
}

function buildWire(inputExpr: string): Wire {
    let inputs: string[];
    let valueFunc: ValueFunc;

    const twoParamInputExpr = twoParamOperationRegex.exec(inputExpr);
    if (twoParamInputExpr) {
        const input1: string = twoParamInputExpr.groups.input1;
        const input2: string = twoParamInputExpr.groups.input2;
        inputs = [input1, input2];

        const operator = twoParamInputExpr.groups.operator as TwoParamOperator;
        const combinationFunc: CombinationFunc = getCombinationFunc(operator);
        valueFunc = (valueProvider) => {
            const v1: number = valueProvider(input1);
            const v2: number = valueProvider(input2);
            return combinationFunc(v1, v2);
        };
    } else {
        const oneParamInputExpr = oneParamOperationRegex.exec(inputExpr);
        const input: string = oneParamInputExpr.groups.input1;
        inputs = [input];

        const notOperator = inputExpr.startsWith('NOT');
        valueFunc = (valueProvider) => {
            const v: number = valueProvider(input);
            return notOperator ? ~v : v;
        };
    }

    return {
        inputs,
        value: valueFunc,
        output: null,
    };
}