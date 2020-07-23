import { readInput } from '@/util/file-utils';
import { getAllNumericCombinations } from "@/util/combination.util";

interface SingleRoute {
    a: string;
    b: string;
    distance: number;
}

interface CombinedRoute {
    locations: string[];
    distance: number;
}

let locationColWidth;
let distanceColWidth;

function getDistance(locA: string, locB: string, singleRoutes: SingleRoute[]): number {
    const routes = singleRoutes.filter(r => (r.a === locA && r.b === locB) || (r.a === locB && r.b === locA));
    if (routes.length > 1) {
        throw new Error('unexpected error happened: more than one matching direct route found');
    }
    return routes[0].distance;
}

function calculateTotalDistance(routeLocations: string[], singleRoutes: SingleRoute[]) {
    let totalDistance = 0;
    for (let i = 0; i < routeLocations.length - 1; i++) {
        const locA = routeLocations[i];
        const locB = routeLocations[i + 1];
        const distance = getDistance(locA, locB, singleRoutes);
        totalDistance += distance;
    }

    distanceColWidth = Math.max(String(totalDistance).length, distanceColWidth);
    return totalDistance;
}

export default async function (puzzleKey): Promise<void> {
    const input = await readInput(puzzleKey);

    const singleRoutes: SingleRoute[] = input
        .split('\n')
        .map((line: string) => {
            const part1 = line.split(' to ');
            const part2 = part1[1].split(' = ');
            return ({
                a: part1[0],
                b: part2[0],
                distance: parseInt(part2[1], 10),
            });
        });

    const locations = [
        ...singleRoutes.map(r => r.a),
        ...singleRoutes.map(r => r.b),
    ]
        .filter((l, i, arr) => arr.indexOf(l) == i)
        .sort((a, b) => a.localeCompare(b));
    locationColWidth = Math.max(...locations.map(l => l.length));

    const combinedRoutes: CombinedRoute[] = getAllNumericCombinations(locations.length)
        .map(combination => combination.map(i => locations[i]))
        .map(routeLocations => ({ locations: routeLocations, distance: calculateTotalDistance(routeLocations, singleRoutes) }));
    console.log('All routes:');
    console.log(printCombinedRoutes(locations, combinedRoutes));

    const shortestRoute = combinedRoutes
        .slice()
        .sort((a, b) => a.distance - b.distance)[0];
    console.log('\nShortest route:');
    console.log(printCombinedRoute(shortestRoute));

    const longestRoute = combinedRoutes
        .slice()
        .sort((a, b) => b.distance - a.distance)[0];
    console.log('\nLongest route:');
    console.log(printCombinedRoute(longestRoute));
}

function printCombinedRoute(combinedRoute: CombinedRoute) {
    const locationsStr = combinedRoute.locations
        .map(l => l.padEnd(locationColWidth, ' '))
        .join(' -> ');
    const distanceStr = String(combinedRoute.distance).padStart(distanceColWidth, ' ');
    return locationsStr + ' = ' + distanceStr;
}

function printCombinedRoutes(locations: string[], combinedRoutes: CombinedRoute[]) {
    return combinedRoutes
        .map(combinedRoute => printCombinedRoute(combinedRoute))
        .join('\n');
}
