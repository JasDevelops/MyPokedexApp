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

        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', '#pokemonModal');

        listItemPokemon.appendChild(button); // Append button to list item 
        pokemonsList.appendChild(listItemPokemon); // Append list item to ul
    }

    // Function to show Pokémon details (pokemon as argument)
    function showDetails(pokemon) {
        let pokemonList = getAll();
        let index = pokemonList.indexOf(pokemon);
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

// Bootstrap Modal IIFE to show/hide modal with Pokémons name, height and image 
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

        $('#pokemonModal').modal('show'); // Bootstrap function to show modal
    }

    //swipe functionality
    function showNextPokemon() {
        let nextIndex = (currentIndex + 1) % pokemonRepository.getAll().length;
        let nextPokemon = pokemonRepository.getAll()[nextIndex];
        pokemonRepository.showDetails(nextPokemon); // Reuse showDetails to update modal
    }

    function showPreviousPokemon() {
        let prevIndex = (currentIndex - 1 + pokemonRepository.getAll().length) % pokemonRepository.getAll().length;
        let prevPokemon = pokemonRepository.getAll()[prevIndex];
        pokemonRepository.showDetails(prevPokemon); // Reuse showDetails to update modal
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
        if (event.key === 'Escape' && $('#pokemonModal').hasClass('show')) {
            $('#pokemonModal').modal('hide');
        }
    }
    // Add swipe and ESC event listeners
    function addModalEventListeners() {
        const modal = document.querySelector('.modal');
        modal.addEventListener('pointerdown', handlePointerDown);
        modal.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('keydown', closeOnEscape);
    }

    function removeModalEventListeners() {
        const modal = document.querySelector('.modal');
        modal.removeEventListener('pointerdown', handlePointerDown);
        modal.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('keydown', closeOnEscape);
    }

    $('#pokemonModal').on('shown.bs.modal', addModalEventListeners);
    $('#pokemonModal').on('hidden.bs.modal', removeModalEventListeners);

    return {
        showModal: showModal,
        showNextPokemon: showNextPokemon,
        showPreviousPokemon: showPreviousPokemon
    };
})();

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
