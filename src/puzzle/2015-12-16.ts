import { readInput } from '@/util/file-utils';

interface Person {
    id: string;
    children: number;
    cats: number;
    samoyeds: number; // dog
    pomeranians: number; // dog
    akitas: number; // dog
    vizslas: number; // dog
    goldfish: number;
    trees: number;
    cars: number;
    perfumes: number;
}

interface Entry {
    key: string;
    value: number;
}

const properties = ['children', 'cats', 'samoyeds', 'pomeranians', 'akitas', 'vizslas', 'goldfish', 'trees', 'cars', 'perfumes'];
const createEmptyPerson = () => {
    const tmp = { id: null };
    properties.forEach(key => tmp[key] = null);
    return tmp as Person;
};

export default async function (puzzleKey): Promise<void> {
    const input = await readInput(puzzleKey + '_input');
    const people: Person[] = parsePeople(input);

    const description = await readInput(puzzleKey + '_description');
    const searchedPerson: Person = parseDescription(description);

    findPerson(people, searchedPerson, true);
    findPerson(people, searchedPerson, false);
}

function findPerson(people: Person[], searchedPerson: Person, exactMatch: boolean) {
    const matchingPeople = filterMatchingPeople(searchedPerson, people, exactMatch);
    if (matchingPeople.length === 0) {
        console.log('Could not found a matching person.');
    } else if (matchingPeople.length === 1) {
        const foundPerson = matchingPeople[0];
        console.log(`The searched person is '${foundPerson.id}'.`);
    } else {
        console.log('Found multiple matching people.');
        console.log(matchingPeople);
    }
}

function filterMatchingPeople(searchedPerson: Person, people: Person[], exactMatch: boolean): Person[] {
    return people
        .filter(person => {
            return properties
                .map(key => ({key, value: person[key]}))
                .filter(entry => typeof entry.value === 'number')
                .every(entry => isPropertyMatching(searchedPerson, entry, exactMatch))
        });
}

function isPropertyMatching(searchedPerson: Person, entry: Entry, exactMatch: boolean) {
    if (exactMatch) {
        // Part 1
        return searchedPerson[entry.key] === entry.value;
    } else {
        // Part 2
        if (['cats', 'trees'].includes(entry.key)) {
            return searchedPerson[entry.key] < entry.value;
        } else if (['pomeranians', 'goldfish'].includes(entry.key)) {
            return searchedPerson[entry.key] > entry.value;
        } else {
            return searchedPerson[entry.key] === entry.value;
        }
    }
}

function parsePeople(input: string): Person[] {
    return input.split('\n')
        .map(l => l.trim())
        .map(l => {
            const firstColon = l.indexOf(':');

            const person = createEmptyPerson();
            person.id = l.substr(0, firstColon);

            const props = l.substr(firstColon + 1).trim().split(/,\s?/);
            props
                .map(p => p.split(/:\s?/))
                .forEach(p => person[p[0]] = parseInt(p[1], 10))

            return person;
        });
}

function parseDescription(description: string): Person {
    const person = createEmptyPerson();
    description
        .split('\n')
        .map(l => l.trim())
        .map(l => l.split(/:\s?/))
        .forEach(p => person[p[0]] = parseInt(p[1], 10))
    return person;
}
