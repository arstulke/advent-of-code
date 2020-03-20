export function incrementPresentCount(map, coordinate) {
    const coordinateKey = coordinate.x + ',' + coordinate.y;
    const presentCount = map[coordinateKey] || 0;
    map[coordinateKey] = presentCount + 1;
}

export function move(coordinate, direction: string) {
    if (direction === '^') {
        coordinate.y--;
    } else if (direction === 'v') {
        coordinate.y++;
    } else if (direction === '<') {
        coordinate.x--;
    } else if (direction === '>') {
        coordinate.x++;
    }
    return coordinate;
}

export function countHouses(map) {
    let houseCount = 0;
    for (const coordinate in map) {
        const presents = map[coordinate];
        if (presents >= 1) {
            houseCount++;
        }
    }
    return houseCount;
}
