import {readInput} from '@/util/file-utils';

export default async function (puzzleKey): Promise<void> {
    const input = await readInput(puzzleKey, 'json');
    const json = JSON.parse(input);

    const result1 = sumAllNumbers(json, false);
    console.log('sum of all numbers in json: ' + result1);

    const result2 = sumAllNumbers(json, true);
    console.log('sum of all numbers in json (without objects that contain red): ' + result2);
}

function sumAllNumbers(json, excludeObjectsWithRedValue: boolean): number {
    const filterFn = (v) => {
        if (typeof v === 'object' && !Array.isArray(v)) {
            const redProperty = Object.keys(v)
                .map(k => v[k])
                .find(v => v === 'red');
            if (redProperty) {
                return false;
            }
        }
        return true;
    };
    return traverseObject(
        json,
        excludeObjectsWithRedValue ? filterFn : () => true,
        (v) => typeof v === 'number' ? v : null,
        (pv, cv) => {
            const arr = [];
            Array.isArray(pv) ? arr.push(...pv) : arr.push(pv);
            Array.isArray(cv) ? arr.push(...cv) : arr.push(cv);
            return arr;
        })
        .filter(v => typeof v === 'number')
        .reduce((a, b) => a + b, 0);
}

function traverseObject(
    obj: any,
    filterFn: (v: any) => boolean,
    mapFn: (v: any) => any,
    reduceFn: (pv: any, cv: any, i: number, arr: any[]) => any,
) {
    const arr = Object.keys(obj)
        .map(key => obj[key])
        .filter(filterFn)
        .map(value => {
            if (['object', 'array'].includes(typeof value)) {
                return traverseObject(value, filterFn, mapFn, reduceFn);
            } else {
                return mapFn(value);
            }
        });
    return arr.length > 0 ? arr.reduce(reduceFn) : [];
}
