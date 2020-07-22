interface CharacterGroup {
    ch: string;
    count: number;
}

export default async function (): Promise<void> {
    lookAndSay('3113322113', 40, 1);
    lookAndSay('3113322113', 50, 2);
}

function lookAndSay(input: string, iterations: number, run: number) {
    let value = input;
    for (let i = 0; i < iterations; i++) {
        const groups = groupCharacters(value);
        value = sayGroups(groups);
    }
    console.log(`output #${run}: ${value}\nlength #${run}: ${value.length}\n`);
}

function groupCharacters(inputStr: string): CharacterGroup[] {
    const groups: CharacterGroup[] = [];
    for (let i = 0; i < inputStr.length; i++) {
        const lastGroup: CharacterGroup = groups[groups.length - 1];
        const ch = inputStr[i];
        if (groups.length === 0 || lastGroup.ch !== ch) {
            groups.push({ch, count: 1});
        } else {
            lastGroup.count++;
        }
    }
    return groups;
}

function sayGroups(groups: CharacterGroup[]) {
    return groups
        .map(group => group.count + group.ch)
        .join('');
}
