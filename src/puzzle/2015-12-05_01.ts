import { countNiceMessages } from '@/puzzle/2015-12-05_lib';

export default async function (puzzleKey: string): Promise<void> {
    await countNiceMessages(puzzleKey, (str: string) => isMessageNice(str));
}

function isMessageNice(str: string): boolean {
    return matchesCondition1(str)
        && matchesCondition2(str)
        && matchesCondition3(str);
}

// contains at least thee vowels (aeiou)
function matchesCondition1(str: string): boolean {
    const vowels = 'aeiou';

    let vowelCount = 0;
    for (let i = 0; i < str.length; i++) {
        const letter = str[i];
        if (vowels.includes(letter)) {
            vowelCount++;
        }
    }

    return vowelCount >= 3;
}

// contains at least one letter that appears twice in a row
function matchesCondition2(str: string): boolean {
    let lastLetter = str[0];
    let lettersInARow = 1;
    for (let i = 1; i < str.length; i++) {
        const letter = str[i];
        if (lastLetter === letter) {
            lettersInARow++;
        } else {
            lettersInARow = 1;
        }

        if (lettersInARow >= 2) {
            return true;
        }
        lastLetter = letter;
    }
    return false;
}

// does not contain the strings ab, cd, pq, or xy
function matchesCondition3(str: string): boolean {
    const forbiddenStrings = ['ab', 'cd', 'pq', 'xy'];
    for (const forbiddenString of forbiddenStrings) {
        if (str.includes(forbiddenString)) {
            return false;
        }
    }
    return true;
}
