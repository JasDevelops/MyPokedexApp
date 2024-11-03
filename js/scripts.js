// IIFE Array-list of Pokemons
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    // create pokemonList accessible outside of the function
    function getAll() {
        return pokemonList;
    }
    // add pokemon (items) if conditions are met
    function add(addPokemon) {
        let keysNeeded = ['name', 'height', 'type'];
        if (
            typeof addPokemon === 'object' && // checks if item is an object
            Object.keys(addPokemon).length === keysNeeded.length && // checks if amount of keys in item is the same as the amount defined in keysNeeded
            addPokemon !== null && // prevent typeof null === 'object' quirk
            addPokemon.name !== undefined && // checks if name is defined
            addPokemon.height !== undefined && //checks if height is defined
            addPokemon.type !== undefined // checks if type is defined
        ) {
            pokemonList.push(addPokemon); // add item if expectations are met
        } else {
            console.error('Please provide an object with name, height and type properties') // print error in console, if expectations were not met
        }
    }
    // Function to add event listener to button
    function addListenerToButton(button, pokemon) {
        button.addEventListener('click', function () { // Event listener, that listens to 'click'
            showDetails(pokemon); // Call showDetails()-function with pokemon as parameter
        });
    }
    // Function to create list items with Pokémon details including a button that displays the name
    function addListItem(pokemon) {
        let pokemonsList = document.querySelector('.pokemon-list');
        let listItemPokemon = document.createElement('li');
        let button = document.createElement('button');

        button.innerText = pokemon.name; // Text of Button is = name of Pokémon
        button.classList.add('button-class'); // Add a class to the button for easier styling
        addListenerToButton(button, pokemon); // function addListenerTo Button is called and passed with the 2 arguments (button, pokemon)

        listItemPokemon.appendChild(button); // Append button to list item 
        pokemonsList.appendChild(listItemPokemon); // Append list item to ul
    }

    // Function to show Pokémon details (pokemon as argument)
    function showDetails(pokemon) {
        console.log(pokemon);
    }

    // make them accessible from outside of the function
    return {
        getAll: getAll,
        add: add,
        addListItem: addListItem,
        showDetails: showDetails
    }
})();
// filter() - function : filter by name
function findName(nameList, nameSearched) {
    return nameList.filter((addPokemon) =>
        addPokemon.name.toLowerCase().includes(nameSearched.toLowerCase())
    );
}
pokemonRepository.getAll().forEach(pokemonRepository.addListItem);


// pokemonRepository.add({name: 'Butterfree', height: 1.1, type: ['bug','flying'] }); // check if add() works
// console.log(findName(pokemonRepository.getAll(), 'pidgey')); // check if filter() works
