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

export function getAllPartCombinations(partCount: number, maxValue: number): number[][] {
    const combinations = [];

    const parts = [];
    for (let i = 0; i < partCount; i++) {
        parts[i] = 0;
    }
    while(parts[0] <= maxValue) {
        const lastIndex = partCount - 1;
        parts[lastIndex]++;
        for (let i = lastIndex; i > 0; i--) {
            if (parts[i] > maxValue) {
                parts[i] = 0;
                parts[i - 1]++;
            }
        }

        const sum = parts.reduce((a, b) => a + b, 0);
        if (sum === maxValue) {
            const newCombination = parts.slice();
            combinations.push(newCombination);
        }
    }

    return combinations;
}