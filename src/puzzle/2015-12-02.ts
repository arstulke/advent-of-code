import { readInput } from '@/util/file-utils';
import { rootCertificates } from 'tls';

export default async function(puzzleKey: string): Promise<void> {
    const input: string = await readInput(puzzleKey);
    const boxesDimensions: string[] = input.split('\n');

    let totalWrappingPaperAmount = 0;
    let totalRibbonLength = 0;
    for (const boxDimensions of boxesDimensions) {
        const singleBoxDimensions = boxDimensions.split('x');
        const l: number = parseInt(singleBoxDimensions[0], 10);
        const w: number = parseInt(singleBoxDimensions[1], 10);
        const h: number = parseInt(singleBoxDimensions[2], 10);

        const side1 = l * w;
        const side2 = w * h;
        const side3 = h * l;
        const surfaceArea = 2 * side1 + 2 * side2 + 2 * side3;
        const extraPaperArea = Math.min(side1, side2, side3);
        const totalPaperArea = surfaceArea + extraPaperArea;
        totalWrappingPaperAmount += totalPaperArea;

        const perimeter1 = 2 * l + 2 * w;
        const perimeter2 = 2 * w + 2 * h;
        const perimeter3 = 2 * l + 2 * h;
        const ribbon = Math.min(perimeter1, perimeter2, perimeter3);
        const ribbonBow = l * w * h;
        const ribbonLength = ribbon + ribbonBow;
        totalRibbonLength += ribbonLength;
    }
    console.log('total wrapping paper amount: ' + totalWrappingPaperAmount);
    console.log('total ribbon length: ' + totalRibbonLength);
}