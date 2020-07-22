const alphabet = toCharArray('abcdefghjkmnpqrstuvwxyz');
const maxNum = alphabet.length - 1;

const decodePassword = (str: string) => toCharArray(str).map(ch => alphabet.indexOf(ch));
const encodePassword = (numArr: number[]) => numArr.slice().map(index => alphabet[index]).join('');

export default async function (): Promise<void> {
    const newPassword = generatePassword('cqjxjnds');
    generatePassword(newPassword);
}

function generatePassword(previous: string): string {
    let decoded = decodePassword(previous);

    do {
        decoded = incrementPassword(decoded);
        // console.log('[' + decoded.join(',') + ']  ' + encodePassword(decoded));
    } while (!isValid(decoded));
    const encoded = encodePassword(decoded);
    console.log('new password: ' + encoded);
    return encoded;
}

function isValid(password: number[]): boolean {
    // includes one increasing straight (without skipping character) with at leas 3 character
    const containsIncreasingStraight = (() => {
        let lastCh = null;
        let straightCount = 1;
        for (let i = 0; i < password.length; i++) {
            const ch = password[i];
            const isNotInStraight = lastCh === null || lastCh + 1 !== ch;
            straightCount = isNotInStraight ? 1 : straightCount + 1;
            lastCh = ch;

            if (straightCount >= 3) {
                return true;
            }
        }
        return false;
    })();

    // contain two different non-overlapping pairs: aa, bb, zz
    const containsTwoDifferentPairs = (() => {
        const pairs = [];
        let lastCh = null;
        let pairCount = 0;
        for (let i = 0; i < password.length; i++) {
            const ch = password[i];
            const isNotPair = lastCh === null || lastCh !== ch || pairs.includes(ch);
            pairCount = isNotPair ? 1 : pairCount + 1;
            lastCh = ch;

            if (pairCount >= 2) {
                pairs.push(ch);
            }
        }

        return pairs.length >= 2;
    })();

    return containsIncreasingStraight && containsTwoDifferentPairs;
}

function incrementPassword(password: number[]): number[] {
    const lastIndex = password.length - 1;

    password[lastIndex]++;
    for (let i = lastIndex; i > 0; i--) {
        const num = password[i];
        if (num > maxNum) {
            password[i] = 0;
            password[i - 1]++;
        }
    }

    return password;
}

function toCharArray(str: string): string[] {
    const ch = [];
    for (let i = 0; i < str.length; i++) {
        ch.push(str[i]);
    }
    return ch;
}
