import {readInput} from '@/util/file-utils';
import {getAllPartCombinations} from "@/util/combination.util";

interface Ingredient {
    name: string;
    capacity: number;
    durability: number;
    flavor: number;
    texture: number;
    calories: number;
}

const statsForScore = ['capacity', 'durability', 'flavor', 'texture'];

interface Recipe {
    ingredients: {
        ingredient: Ingredient;
        amount: number;
    }[];
    totalScore: number;
}

export default async function (puzzleKey): Promise<void> {
    const input = await readInput(puzzleKey);
    const ingredients = parseIngredients(input);
    const allRecipes = getAllRecipes(ingredients);

    getBestRecipe(allRecipes);
    getBestRecipe(allRecipes, 500);
}

function printRecipe(recipe: Recipe) {
    for (const i of recipe.ingredients) {
        console.log(String(i.amount).padStart(3), i.ingredient.name);
    }
    calculateTotalScore(recipe, true);
    console.log('score: ' + recipe.totalScore);
    console.log('');
}

function calculateProperty(recipe: Recipe, propertyKey: string) {
    const propertyValue = recipe.ingredients
        .map(i => i.ingredient[propertyKey] * i.amount)
        .reduce((a, b) => a + b, 0);
    return Math.max(propertyValue, 0);
}

function calculateTotalScore(r: Recipe, print: boolean = false) {
    if (print) {
        const stats = [];
        for (const statKey of [...statsForScore, 'calories']) {
            const betterStatKey = statKey.padStart(10, ' ');
            const a = r.ingredients.map(i => i.ingredient[statKey] + '*' + i.amount);
            const b = r.ingredients.map(i => i.ingredient[statKey] * i.amount);
            const c = b.reduce((a1, a2) => a1 + a2, 0);
            console.log(betterStatKey + ' = ' + a.join(' + ') + ' = ' + b.join(' + ') + ' = ' + c);

            if (statsForScore.includes(statKey)) {
                stats.push(c);
            }
        }
        const betterStats = stats.map(a => Math.max(a, 0));
        console.log(betterStats.join(' * ') + ' = ' + betterStats.reduce((a, b) => a * b, 1));
    }


    return statsForScore
        .map(stat => calculateProperty(r, stat))
        .reduce((a, b) => a * b, 1);
}

function createCaloriesFilter(calories?: number) {
    if (calories === null || calories === undefined) {
        return () => true;
    } else {
        return (recipe) => calculateProperty(recipe, 'calories') === calories;
    }
}

function getBestRecipe(allRecipes: Recipe[], calories?: number): void {
    let caloriesString = '';
    if (typeof calories === 'number') {
        allRecipes = allRecipes.filter((recipe) => calculateProperty(recipe, 'calories') === calories);
        caloriesString = ` (with exact ${calories} calories)`;
    }

    const bestRecipe = allRecipes[0];
    console.log(`best recipe${caloriesString}:`);
    printRecipe(bestRecipe);
}

function getAllRecipes(ingredients: Ingredient[]) {
    return getAllPartCombinations(ingredients.length, 100)
        .map(combination => {
            const recipe: Recipe = {
                ingredients: combination.map((amount, index) => {
                    return {ingredient: ingredients[index], amount};
                }),
                totalScore: null,
            };
            recipe.totalScore = calculateTotalScore(recipe);
            return recipe;
        })
        .sort((a, b) => b.totalScore - a.totalScore);
}

function parseIngredients(input: string): Ingredient[] {
    return input.split('\n')
        .map(l => l.trim())
        .map(l => {
            const numbers = l.match(/-?[0-9]+/g).map(str => parseInt(str, 10));
            return {
                name: l.match(/^[^:]*/)[0],
                capacity: numbers[0],
                durability: numbers[1],
                flavor: numbers[2],
                texture: numbers[3],
                calories: numbers[4],
            };
        });
}
