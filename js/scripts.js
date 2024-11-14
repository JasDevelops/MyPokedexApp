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
        hideLoadingMessage(); // Hide loading message once response is received
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
      .catch((e) => {
        hideLoadingMessage(); // Hide loading message in case of an error
        console.error(e);
      });
  }

  // Fetch details for a specific Pokemon
  function loadDetails(pokemon) {
    showLoadingMessage();
    return fetch(pokemon.detailsUrl)
      .then((response) => {
        hideLoadingMessage();
        return response.json();
      })
      .then((details) => {
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height;
      })
      .catch((e) => {
        hideLoadingMessage();
        console.error(e);
      });
  }

  // Show a loading message
  function showLoadingMessage() {
    let loadingMessage = document.createElement('p');
    loadingMessage.innerText = 'Hold tight, Trainer! Rare finds take time!';
    loadingMessage.classList.add('loading-message');
    document.body.appendChild(loadingMessage);
  }

  // Hide the loading message
  function hideLoadingMessage() {
    let loadingMessage = document.querySelector('.loading-message');
    if (loadingMessage) {
      loadingMessage.remove();
    }
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

  function showModal(title, height, imageUrl, index) {
    let modalTitle = document.querySelector('.modal-title');
    let modalBody = document.querySelector('.modal-body');
    let modalItem = document.getElementById('pokemonModal');

    modalTitle.innerText = title;

    // Clear the modal body
    modalBody.textContent = ''; // This removes existing content safely

    // Create paragraph element for height
    const heightParagraph = document.createElement('p');
    heightParagraph.textContent = `Height: ${height}`;

    // Create image element
    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = title;

    // Append elements to modalBody
    modalBody.appendChild(heightParagraph);
    modalBody.appendChild(image);

    currentIndex = index;

    cleanUpBackdrops(); // Clean up lingering backdrops

    let bootstrapModal = new bootstrap.Modal(modalItem);

    modalItem.addEventListener('hidden.bs.modal', cleanUpBackdrops);
    bootstrapModal.show();
  }

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

  function cleanUpBackdrops() {
    let backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach((backdrop) => backdrop.remove());
  }

  return {
    showModal,
    showNextPokemon,
    showPreviousPokemon,
  };
})();

// Search functionality
document.getElementById('search-button').addEventListener('click', function () {
  const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
  const foundPokemon = pokemonRepository
    .getAll()
    .find((pokemon) => pokemon.name.toLowerCase() === searchInput);

  if (foundPokemon) {
    pokemonRepository.showDetails(foundPokemon);
  } else {
    alert('Hmm, nothing here... perhaps it used Teleport!');
  }
});

// Sorting functionality
function sortPokemon(criteria) {
  Promise.all(
    pokemonRepository.getAll().map((pokemon) => pokemonRepository.loadDetails(pokemon))
  ).then(() => {
    let sortedList = pokemonRepository.getAll();
    if (criteria === 'name') {
      sortedList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'height') {
      sortedList.sort((a, b) => a.height - b.height);
    }

    const pokemonListItem = document.querySelector('.pokemon-list');
    pokemonListItem.innerHTML = ''; // Clear existing list

    sortedList.forEach((pokemon) => pokemonRepository.addListItem(pokemon, criteria === 'height'));
  });
}

// Add event listeners to sorting dropdown
document.querySelectorAll('.dropdown-item').forEach((item) => {
  item.addEventListener('click', function (event) {
    event.preventDefault();
    const sortCriteria = this.getAttribute('data-sort');
    sortPokemon(sortCriteria);
  });
});

// Load initial list of Pokemon
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
