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

// for()-loop to iterate over each object within array 
// if height > 1 addition of highlight-text
for (let i = 0; i < pokemonList.length; i++) {
    let name = pokemonList[i].name;
    let height = pokemonList[i].height;

    let text =
        height > 1
            ? `<span class="card__front--name">${name}</span> (height: ${height}) - Wow, that's big!`
            : `<span class="card__front--name">${name}</span> (height: ${height})`;

    document.write(`<div class="card__front">${text}</div>`);
}