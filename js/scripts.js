// Array-list of Pokemons
let pokemonList = [
    {
        name:'Bulbasaur',
        height: 0.7,
        types: ['grass','poison']
    },
    {
        name:'Pidgey',
        height: 0.3,
        types: ['flying','normal']

    },
    {
        name:'Nidoking',
        height: 1.4,
        types: ['ground','poison']
    }
];

// for()-loop to iterate over each object within array
for (let i = 0; i < pokemonList.length; i++) {
    document.write(
        pokemonList[i].name + " (height: " + pokemonList[i].height + ")<br>"
    );
}