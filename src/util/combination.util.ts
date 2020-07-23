export function getAllNumericCombinations(itemCount: number): number[][] {
    function getInheritedCombinations(rootCombination: number[], possibleValues: number[]): number[][] {
        const unflatArr = possibleValues.map((pv, index) => {
            const possibleValuesNew = possibleValues.slice();
            possibleValuesNew.splice(index, 1);

            const combination = rootCombination.slice();
            combination.push(pv);

            if (possibleValuesNew.length > 0) {
                return getInheritedCombinations(combination, possibleValuesNew);
            } else {
                return [combination];
            }
        });

        const flatArr = [];
        for (const combinations of unflatArr) {
            for (const combination of combinations) {
                flatArr.push(combination);
            }
        }

        return flatArr;
    }

    const possibleValues: number[] = (() => {
        const arr = [];
        for (let i = 0; i < itemCount; i++) {
            arr.push(i);
        }
        return arr;
    })();
    return getInheritedCombinations([], possibleValues);
}