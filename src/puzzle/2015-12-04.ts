import * as md5 from 'md5';

export default async function (): Promise<void> {
    findMatchingHash('ckczppom', '00000');
    findMatchingHash('ckczppom', '000000');
}

function findMatchingHash(input: string, leadingStr: string) {
    let i;
    let hashInput: string;
    let hash: string = null;

    for (i = 0; hash == null || !hash.startsWith(leadingStr); i++) {
        hashInput = input + i;
        hash = md5(hashInput);
    }
    i--;

    console.log('hashInput: ' + hashInput);
    console.log('hash: ' + hash);
    console.log('number: ' + i);
}
