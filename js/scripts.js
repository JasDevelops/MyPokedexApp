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
        let pokemonsList = document.querySelector('.pokemon-list'); // ul-element
        let listItemPokemon = document.createElement('li'); // li-element
        let button = document.createElement('button'); // button for aech pokémon

        button.innerText = pokemon.name; // Text of Button is = name of Pokémon
        button.classList.add('button-class', 'list-group-item', 'list-group-item-action', 'btn', 'btn-primary'); // Add list-group class to list
        listItemPokemon.classList.add('list-group', 'col-lg-4', 'col-md-6', 'col-12'); // Add list-group-item-class to list, 3 col for large, 2 for medium, 1 for small screens

        addListenerToButton(button, pokemon); // function addListenerTo Button is called and passed with the 2 arguments (button, pokemon)

        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#pokemonModal');

        listItemPokemon.appendChild(button); // Append button to list item 
        pokemonsList.appendChild(listItemPokemon); // Append list item to ul
    }

    // Function to show Pokémon details (pokemon as argument)
    function showDetails(pokemon) {
        let pokemonList = getAll();
        let index = pokemonList.indexOf(pokemon); // Keep track of current pokémon
        loadDetails(pokemon).then(function () {
            modal.showModal(pokemon.name, pokemon.height, pokemon.imageUrl, index);
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

// Bootstrap Modal IIFE 
let modal = (function () {
    let currentIndex = 0; // current displayed Pokémon index

    function showModal(title, height, imageUrl, index) { // show modal
        let modalTitle = document.querySelector('.modal-title'); // find modal title
        let modalBody = document.querySelector('.modal-body'); // find modal body

        modalTitle.innerText = title;
        modalBody.innerHTML = `
    <p>Height: ${height}</p>
    <img src="${imageUrl}" alt="${title}">
    `;
        currentIndex = index; // Track current Pokémon index

        // Bootstrap  5 function to show modal
        let modalItem = document.getElementById('pokemonModal');
        let bootstrapModal = bootstrap.Modal.getInstance(modalItem);

        cleanUpBackdrops(); // Cleans lingering backdrops before showing

        modalItem.addEventListener('hidden.bs.modal', cleanUpBackdrops);

        bootstrapModal.show(); // Correct placement
    }

    //next/previous functionality
    function showNextPokemon() {
        let pokemonList = pokemonRepository.getAll();
        currentIndex = (currentIndex + 1) % pokemonList.length;
        pokemonRepository.showDetails(pokemonList[currentIndex]);
    }

    function showPreviousPokemon() {
        let pokemonList = pokemonRepository.getAll();
        currentIndex = (currentIndex - 1 + pokemonList.length) % pokemonList.length;
        pokemonRepository.showDetails(pokemonList[currentIndex]);
    }

    function handlePointerDown(event) {
        this.startX = event.clientX;
    }

    function handlePointerUp(event) {
        let endX = event.clientX;
        let threshold = 50;

        if (endX < this.startX - threshold) {
            showNextPokemon();
        } else if (endX > this.startX + threshold) {
            showPreviousPokemon();
        }
    }
    // close when ESC-key is pressed
    function closeOnEscape(event) {
        if (event.key === 'Escape') {
            let modalItem = document.getElementById('pokemonModal');
            let bootstrapModal = bootstrap.Modal.getInstance(modalItem);
            if (bootstrapModal) {
                bootstrapModal.hide(); // Hides the modal
            }
        }
    }
    // Add swipe and ESC event listeners
    document.getElementById('pokemonModal').addEventListener('shown.bs.modal', function () {
        const modalItem = document.querySelector('.modal');
        modalItem.addEventListener('pointerdown', handlePointerDown);
        modalItem.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('keydown', closeOnEscape);
    });

    document.getElementById('pokemonModal').addEventListener('hidden.bs.modal', function () {
        const modalItem = document.querySelector('.modal');
        modalItem.removeEventListener('pointerdown', handlePointerDown);
        modalItem.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('keydown', closeOnEscape);
    });

    return {
        showModal: showModal,
        showNextPokemon: showNextPokemon,
        showPreviousPokemon: showPreviousPokemon
    };
})();
// Search function
document.getElementById('search-button').addEventListener('click', function () {
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase(); // User input, removing accidental spaces and including lowercase
    const foundPokemon = pokemonRepository.getAll().find(pokemon => pokemon.name.toLowerCase() === searchInput
    ); // loops through Pokémon list to find match 
    if (foundPokemon) {
        pokemonRepository.showDetails(foundPokemon); // shows modal for found Pokémon
    } else {
        alert('Hmm, nothing here... perhaps it used Teleport!') // alert message
    }
});
// sorting - function
function sortPokemon(criteria) {
    Promise.all(pokemonRepository.getAll().map(pokemon => pokemonRepository.loadDetails(pokemon))).then(() => {
        let sortedList = pokemonRepository.getAll();
        if (criteria === 'name') {
            sortedList.sort((a, b) => a.name.localeCompare(b.name)); // sort alphabetically
        } else if (criteria === 'height') {
            sortedList.sort((a, b) => a.height - b.height); // sort numerically
        }

        //clear and re-render sorted List
        const pokemonListItem = document.querySelector('.pokemon-list');
        pokemonListItem.innerHTML = '';
        sortedList.forEach(pokemon => pokemonRepository.addListItem(pokemon)); // Displays sorted Pokémon
    });
}
// Event listener for dropdown-items
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault(); // Prevents default link behavior
        const sortCriteria = this.getAttribute('data-sort'); // Gets sorting criteria
        sortPokemon(sortCriteria); // Calls  sorting function
    });
});

// filter() - function : filter by name
function findName(nameList, nameSearched) {
    return nameList.filter((addPokemon) =>
        addPokemon.name.toLowerCase().includes(nameSearched.toLowerCase())
    );
}

// load inital List
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});
