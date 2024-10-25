// IIFE Array-list of Pokemons
let pokemonRepository = (function () {
    let pokemonList = [
        {
            name: 'Bulbasaur',
            height: 0.7,
            type: ['grass', 'poison']
        },
        {
            name: 'Pidgey',
            height: 0.3,
            type: ['flying', 'normal']

        },
        {
            name: 'Nidoking',
            height: 1.4,
            type: ['ground', 'poison']
        }
    ];
    // create pokemonList accessible outside of the function
    function getAll() {
        return pokemonList;
    }
    // add pokemon (items) if conditions are met
    function add(pokemon) {
        let keysNeeded = ['name', 'height', 'type'];
        if (
            typeof pokemon === 'object' && // checks if item is an object
            Object.keys(pokemon).length === keysNeeded.length && // checks if amount of keys in item is the same as the amount defined in keysNeeded
            pokemon !== null && // prevent typeof null === 'object' quirk
            pokemon.name !== undefined && // checks if name is defined
            pokemon.height !== undefined && //checks if height is defined
            pokemon.type !== undefined // checks if type is defined
        ) {
            pokemonList.push(pokemon); // add item if expectations are met
        } else {
            console.error('Please provide an object with name, height and type properties') // print error in console, if expectations were not met
        }
    }
    // make them accessible from outside of the function
    return {
        getAll: getAll,
        add: add,
    }
})();
// forEach ()-loop to iterate over each object within array
function PokemonDetailsLoop(details) {
    let name = details.name;
    let height = details.height;
    let text =
        height > 1
            ? `<span class='card__front--name'>${name}</span> (height: ${height}) - Wow, that's big!`
            : `<span class='card__front--name'>${name}</span> (height: ${height})`;

    document.write(`<div class='card__front'>${text}</div>`);
}

// filter() - function : filter by name
function findName(nameList, nameSearched) {
    return nameList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(nameSearched.toLowerCase())
    );
}

// pokemonRepository.add({name: 'Butterfree', height: 1.1, type: ['bug','flying'] }); // check if add() works
// console.log(findName(pokemonRepository.getAll(), 'pidgey')); // check if filter() works

pokemonRepository.getAll().forEach(PokemonDetailsLoop);
