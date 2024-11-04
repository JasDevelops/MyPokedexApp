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
        let keysNeeded = ['name', 'detailsUrl'];
        let addPokemonKeys = Object.keys(addPokemon);
        if (
            typeof addPokemon === 'object' && // checks if item is an object
            addPokemon !== null && // prevent typeof null === 'object' quirk
            keysNeeded.every(key => addPokemonKeys.includes(key)) // check if addPokemon has name and detailsUrl
        ) {
            pokemonList.push(addPokemon); // add item if expectations are met
        } else {
            console.error('Please provide an object with name and detailsUrl properties') // print error in console, if expectations were not met
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
        loadDetails(pokemon).then(function () {
            modal.showModal(pokemon.name, pokemon.height, pokemon.imageUrl);
        });
    }

    // Function to fetch list of Pokémon from API
    function loadList() {
        showLoadingMessage(); // shows loading message
        return fetch(apiUrl).then(function (response) {
            hideLoadingMessage(); // hides loading message once response received
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function (e) {
            hideLoadingMessage(); // hide loading message in case of error
            console.error(e);
        });
    }

    // function to load details for a given Pokémon
    function loadDetails(pokemon) {
        showLoadingMessage(); // shows loading message
        let url = pokemon.detailsUrl;
        return fetch(url).then(function (response) {
            hideLoadingMessage(); // hides loading message once response received
            return response.json();
        }).then(function (details) {
            // Now we add the details to the item
            pokemon.imageUrl = details.sprites.front_default;
            pokemon.height = details.height;
        }).catch(function (e) {
            hideLoadingMessage(); // hide loading message in case of error
            console.error(e);
        });
    }

    // show and hide loading message

    function showLoadingMessage() {
        let loadingMessage = document.createElement('p'); // creates <p> element
        loadingMessage.innerText = 'Hold tight, Trainer! Rare finds take time!'; // sets the text to the created element
        loadingMessage.classList.add('loading-message'); // adds class for easier styling
        document.body.appendChild(loadingMessage); // adds element to body container    
    }
    function hideLoadingMessage() {
        let loadingMessage = document.querySelector('.loading-message'); // finds element with .loading-message class
        if (loadingMessage) {
            loadingMessage.remove(); // removes element from the DOM
        }
    }

    // make them accessible from outside of the function
    return {
        getAll: getAll,
        add: add,
        addListItem: addListItem,
        showDetails: showDetails,
        loadList: loadList,
        loadDetails: loadDetails
    }
})();

// Modal IIFE to show/hide modal with Pokémons name, height and image 
let modal = (function () {
    function showModal(title, height, imageUrl) { // show modal
        let modalContainer = document.querySelector('#modal-container'); // select modal container in the DOM
        modalContainer.innerHTML = ''; // clear existing content in modal

        let modal = document.createElement('div'); // create modal div
        modal.classList.add('modal'); // add 'modal'- class for easier styling

        let closeButtonElement = document.createElement('button'); // create close button
        closeButtonElement.classList.add('modal-close'); // add 'modal-close' - class for easier styling
        closeButtonElement.innerText = 'Close'; // set text of button
        closeButtonElement.addEventListener('click', hideModal); // closes modal on click

        let titleElement = document.createElement('h1'); // create h1
        titleElement.innerText = title; // sets modal title text

        let contentElement = document.createElement ('p'); // creates p
        contentElement.innerText = ` Height: ${height}`; // sets modal content text

        let imageElement = document.createElement ('img'); // create img
        imageElement.src = imageUrl; // defines source of image
        imageElement.alt = `${title} image`; // defines alt-tag of image

        //Append all elements to modal and modal container
        modal.appendChild(closeButtonElement);
        modal.appendChild(titleElement);
        modal.appendChild(contentElement);
        modal.appendChild(imageElement);
        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible'); // makes modal visible
    }
    function hideModal () { // hide modal
        modalContainer.classList.remove('is-visible');
    }
    window.addEventListener('keydown', (e) => { // hide when ESC-key is pressed
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });
    modalContainer.addEventListener('click', (e) => { // hide when clicked outside of modal
        let target = e.target;
        if (target === modalContainer) {
            hideModal();
        }
    });
    return {
        showModal: showModal
    };
}) ();

// filter() - function : filter by name
function findName(nameList, nameSearched) {
    return nameList.filter((addPokemon) =>
        addPokemon.name.toLowerCase().includes(nameSearched.toLowerCase())
    );
}
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});

// pokemonRepository.add({name: 'Butterfree', height: 1.1, type: ['bug','flying'] }); // check if add() works
// console.log(findName(pokemonRepository.getAll(), 'pidgey')); // check if filter() works
