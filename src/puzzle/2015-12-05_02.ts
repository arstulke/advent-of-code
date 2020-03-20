import { countNiceMessages } from '@/puzzle/2015-12-05_lib';

export default async function (puzzleKey: string): Promise<void> {
    await countNiceMessages(puzzleKey, (str: string) => isMessageNice(str));
}

function isMessageNice(str: string): boolean {
    return matchesCondition1(str)
        && matchesCondition2(str);
}

// contains a pair of any two letters that appears at least twice in the string without overlapping
function matchesCondition1(str: string): boolean {
    for (let i = 0; i < str.length - 3; i++) {
        const letterPair = str.substring(i, i + 2);
        const remainingStr = str.substring(i + 2);

        if (remainingStr.includes(letterPair)) {
            return true;
        }
    }
    return false;
}

// contains at least one letter which repeats with exactly one letter between them
function matchesCondition2(str: string): boolean {
    for (let i = 0; i < str.length - 2; i++) {
        const letter = str[i];
        const letterAfterNext = str[i + 2];
        if (letter === letterAfterNext) {
            return true;
        }
    }

    return false;
}
