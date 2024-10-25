// IIFE Array-list of Pokemons
let pokemonRepository = (function () {
    let pokemonList = [
        {
            name: 'Bulbasaur',
            height: 0.7,
            types: ['grass', 'poison']
        },
        {
            name: 'Pidgey',
            height: 0.3,
            types: ['flying', 'normal']

        },
        {
            name: 'Nidoking',
            height: 1.4,
            types: ['ground', 'poison']
        }
    ];
    function getAll() {
        return pokemonList;
    }
    function add(pokemon) {
        let keysNeeded = ['name', 'height', 'types'];
        if (
            typeof pokemon === 'object' && // checks if item is an object
            Object.keys(pokemon).length === keysNeeded.length && // checks if amount of keys in item is the same as the amount defined in keysNeeded
            pokemon !== null && // prevent typeof null === 'object' quirk
            pokemon.name !== undefined && // checks if name is defined
            pokemon.height !== undefined && //checks if height is defined
            pokemon.types !== undefined // checks if types is defined
        ) {
            pokemonList.push(pokemon); // add item if expectations are met
        } else {
            console.error('Please provide an object with name, height and types properties') // print error in console, if expectations were not met
        }
    }
    return {
        getAll: getAll,
        add: add
    }
})();
// forEach ()-loop to iterate over each object within array
function PokemonDetailsLoop(details) {
    let name = details.name;
    let height = details.height;
    let text =
        height > 1
            ? `<span class="card__front--name">${name}</span> (height: ${height}) - Wow, that's big!`
            : `<span class="card__front--name">${name}</span> (height: ${height})`;

    document.write(`<div class="card__front">${text}</div>`);
}

pokemonRepository.getAll().forEach(PokemonDetailsLoop);