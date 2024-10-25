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
        pokemonList.push(pokemon);
    }
    return {
        getAll: getAll,
        add: add
    };

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