// IIFE for Pokemon Repository
let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  // Create pokemonList accessible outside of the function
  function getAll() {
    return pokemonList;
  }

  // Add a Pokemon to the list if it meets the required conditions
  function add(addPokemon) {
    let keysNeeded = ['name', 'detailsUrl'];
    let addPokemonKeys = Object.keys(addPokemon);

    if (
      typeof addPokemon === 'object' && // Check if the item is an object
      addPokemon !== null && // Prevent null values (typeof null === 'object')
      keysNeeded.every((key) => addPokemonKeys.includes(key)) // Ensure 'name' and 'detailsUrl' keys exist
    ) {
      pokemonList.push(addPokemon);
    } else {
      console.error('Please provide an object with name and detailsUrl properties');
    }
  }

  // Function to add an event listener to a button
  function addListenerToButton(button, pokemon) {
    button.addEventListener('click', function () {
      showDetails(pokemon); // Call showDetails with the Pokemon as parameter
    });
  }

  // Create a list item with a button to display the Pokemon's details
  function addListItem(pokemon, showHeight = false) {
    let pokemonsList = document.querySelector('.pokemon-list'); // Get the ul element
    let listItemPokemon = document.createElement('li'); // Create li element
    let button = document.createElement('button'); // Create button for each Pokemon

    button.innerText = pokemon.name; // Set button text to Pokemon's name
    button.classList.add(
      'button-class',
      'list-group-item',
      'list-group-item-action',
      'btn',
      'btn-primary'
    );
    listItemPokemon.classList.add('list-group', 'col-lg-4', 'col-md-6', 'col-12');

    addListenerToButton(button, pokemon); // Add click listener to button

    // Add Bootstrap modal attributes
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#pokemonModal');

    listItemPokemon.appendChild(button); // Append button to li element

    // Display height info if showHeight is true
    if (showHeight) {
      let heightInfo = document.createElement('p');
      heightInfo.innerText = `Height: ${pokemon.height}`;
      heightInfo.classList.add('pokemon-height');
      listItemPokemon.appendChild(heightInfo);
    }

    pokemonsList.appendChild(listItemPokemon); // Append list item to ul
  }

  // Show Pokemon details when a button is clicked
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      let pokemonList = getAll();
      let index = pokemonList.indexOf(pokemon); // Get the index of the current Pokemon
      modal.showModal(pokemon.name, pokemon.height, pokemon.imageUrl, index);
    });
  }

  // Fetch the list of Pokemon from the API
  function loadList() {
    showLoadingMessage(); // Show loading message
    return fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch Pokemon list');
        return response.json();
      })
      .then((json) => {
        json.results.forEach((item) => {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon); // Add each Pokemon to the list
        });
      })
      .catch(showErrorMessage) // showErrorMessage handles UI and log
      .finally(hideLoadingMessage); // Using finally to ensure cleanup
  }

  // Fetch details for a specific Pokemon
  function loadDetails(pokemon) {
    showLoadingMessage();
    return fetch(pokemon.detailsUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch Pokemon details');
        return response.json();
      })
      .then((details) => {
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height;
      })
      .catch(showErrorMessage) // showErrorMessage handles UI and log
      .finally(hideLoadingMessage); // Using finally to ensure cleanup
  }

  // Show a loading message
  function showLoadingMessage() {
    if (!document.querySelector('.loading-message')) {
      let loadingMessage = document.createElement('p');
      loadingMessage.innerText = 'Hold tight, Trainer! Rare finds take time!';
      loadingMessage.classList.add('loading-message');
      document.body.appendChild(loadingMessage);
    }
  }

  // Hide the loading message
  function hideLoadingMessage() {
    let loadingMessage = document.querySelector('.loading-message');
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }

  // Show error message
  function showErrorMessage(error) {
    hideLoadingMessage(); // Clear loading message
    let errorMessage = document.createElement('p');
    errorMessage.innerText = `Error: ${error.message || 'Something went wrong!'}`;
    errorMessage.classList.add('error-message');
    document.body.appendChild(errorMessage);

    setTimeout(() => errorMessage.remove(), 5000); // Auto-remove the error message after 5 seconds
  }
  // Make methods accessible outside of the function
  return {
    getAll,
    add,
    addListItem,
    showDetails,
    loadList,
    loadDetails,
  };
})();

// Bootstrap Modal IIFE
let modal = (function () {
  let currentIndex = 0; // Current displayed Pokemon index
  let modalItem = document.getElementById('pokemonModal');
  let modalInstance;

  function showModal(title, height, imageUrl, index) {
    let modalTitle = document.querySelector('.modal-title');
    let modalBody = document.querySelector('.modal-body');

    let existingBackdrops = document.querySelectorAll('.modal-backdrop'); //  Removes any lingering backdrops before opening a new modal
    existingBackdrops.forEach((backdrop) => backdrop.remove());

    modalTitle.innerText = title;
    modalBody.textContent = ''; // clears modalBody content

    const heightParagraph = document.createElement('p'); // Creates paragraph element for height
    heightParagraph.textContent = `Height: ${height}`;

    const image = document.createElement('img'); // Creates image element
    image.src = imageUrl;
    image.alt = title;
    image.loading = 'lazy';

    // Append elements to modalBody
    modalBody.appendChild(heightParagraph);
    modalBody.appendChild(image);

    currentIndex = index;

  // If there's an existing modal instance, hide it before opening the new one
  if (modalInstance) {
    modalInstance.hide();
  }

  // Create and show new modal
  modalInstance = new bootstrap.Modal(modalItem);
  modalInstance.show();// Manually triggers the modal
}
    // Clean up lingering backdrops (I had an issue with lingering backdrops)
    function cleanUpBackdrops() {
      let backdrops = document.querySelectorAll('.modal-backdrop');// Removes the backdrop element
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove('modal-open'); // Ensures the 'modal-open' class is removed from the body
      document.documentElement.classList.remove('modal-open'); // account for edge cases
      window.scrollTo(0, 0); // Resets the scroll position to the top
    }

    document.getElementById('search-input').value = ''; // clears search input

  function showNextPokemon() {
    let pokemonList = pokemonRepository.getAll();
    if (!pokemonList.length) return;

    currentIndex = (currentIndex + 1) % pokemonList.length;
    pokemonRepository.showDetails(pokemonList[currentIndex]);
  }

  function showPreviousPokemon() {
    let pokemonList = pokemonRepository.getAll();
    if (!pokemonList.length) return;

    currentIndex = (currentIndex - 1 + pokemonList.length) % pokemonList.length;
    pokemonRepository.showDetails(pokemonList[currentIndex]);
  }

  modalItem.addEventListener('hidden.bs.modal', function () { // Event listener for when the modal is fully hidden
    cleanUpBackdrops(); // cleans backdrops after beinh hidden
});
  return {
    showModal,
    showNextPokemon,
    showPreviousPokemon,
  };
})();

// Load initial list of Pokemon
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
// Search functionality
document.getElementById('search-input').addEventListener('input', function (event) {
  //triggers input event, when something is typed into the input field
  const searchInput = event.target.value.trim().toLowerCase(); // Takes input (event.target.value), trim whitespace, convert to lowercase
  showSuggestions(searchInput); // calls showSuggestions () with search query
});
document.getElementById('search-button').addEventListener('click', function () {
  // triggers function when search icon is clicked
  const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
  handleSearch(searchInput);
});
// Filter and display input  based on user's input
function showSuggestions(str) {
  let searchSuggestion = document.getElementById('search-suggestion');
  searchSuggestion.innerHTML = ''; // clears previous results

  let pokemonNames = pokemonRepository.getAll().map((pokemon) => pokemon.name);

  if (str === '') {
    searchSuggestion.style.display = 'none'; // Hide suggestions if input is empty
    return;
  }

  const matchingPokemons = pokemonRepository
    .getAll()
    .filter((pokemon) => pokemon.name.toLowerCase().includes(str))
    .slice(0, 3); // Limit suggestions to 3

  if (matchingPokemons.length === 0) {
    searchSuggestion.innerHTML = '<li class="list-group-item">No Pokémon spottet.</li>';
    searchSuggestion.style.display = 'block';
  } else {
    searchSuggestion.style.display = 'block';
    matchingPokemons.forEach((pokemon) => {
      const suggestionItem = document.createElement('li');
      suggestionItem.classList.add('list-group-item');
      suggestionItem.innerText = pokemon.name;

      suggestionItem.addEventListener('click', function () {
        document.getElementById('search-input').value = pokemon.name;
        searchSuggestion.style.display = 'none'; // hides suggestions after selection
        pokemonRepository.showDetails(pokemon); // shows details modal of matching item
      });

      searchSuggestion.appendChild(suggestionItem); // appends matching itemto serach
    });
  }
}
// Close suggestions when clicking outside
document.addEventListener('click', function (event) {
  const searchInput = document.getElementById('search-input');
  const searchSuggestion = document.getElementById('search-suggestion');
  
  if (!searchInput.contains(event.target) && !searchSuggestion.contains(event.target)) { // Checks if click was outside of the search input and suggestion box
    searchSuggestion.style.display = 'none'; // Hides the suggestions list
  }
});

document.getElementById('search-form').addEventListener('click', function (event) {
  event.stopPropagation();
});
function handleSearch(searchInput) {
  const matchingPokemon = pokemonRepository
    .getAll()
    .find((pokemon) => pokemon.name.toLowerCase() === searchInput);

  if (matchingPokemon) {
    pokemonRepository.showDetails(matchingPokemon); // shows details modal of matching item
    document.getElementById('search-input').value = '';
  } else {
    alert('Hmm, nothing here... perhaps it used Teleport!'); // shows alert, if nothing is found
  }
}
// Sorting functionality
function sortPokemon(criteria) {
  Promise.all(
    // ensures all details are loaded before sorting
    pokemonRepository.getAll().map((pokemon) => {
      if (!pokemon.height) {
        // check if height is not yet loaded
        return pokemonRepository.loadDetails(pokemon);
      }
      return Promise.resolve();
    })
  ).then(() => {
    let sortedList = pokemonRepository.getAll();
    if (criteria === 'name') {
      sortedList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'height') {
      sortedList.sort((a, b) => a.height - b.height);
    }

    const pokemonsListItem = document.querySelector('.pokemon-list');
    pokemonsListItem.innerHTML = ''; // clears list before adding sorted items

    sortedList.forEach((pokemon) => {
      pokemonRepository.addListItem(pokemon, true); // shows height
    });
  });
}

// Add event listeners to sorting dropdown
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.dropdown-item').forEach((item) => {
    item.addEventListener('click', function (event) {
      event.preventDefault();
      const sortCriteria = this.getAttribute('data-sort');
      sortPokemon(sortCriteria);
    });
  });
});
