// Array-list of Pokemons
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

// forEach ()-loop to iterate over each object within array
function PokemonDetailsLoop(pokemon) {
    let name = pokemon.name;
    let height = pokemon.height;
    let text =
        height > 1
            ? `<span class="card__front--name">${name}</span> (height: ${height}) - Wow, that's big!`
            : `<span class="card__front--name">${name}</span> (height: ${height})`;

    document.write(`<div class="card__front">${text}</div>`);
}

pokemonList.forEach(PokemonDetailsLoop);