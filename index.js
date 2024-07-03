function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Fetch Pokemon data and populate datalist when page loads
window.onload = function() {
    const pokemonList = document.getElementById('pokemonList');
    fetch('data/pokemon.json')
    .then(response => response.json())
    .then(data => {
        for (const pokemon of data.results) {
            let option = document.createElement('option');
            option.value = pokemon.name;
            pokemonList.appendChild(option);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

function findPokemon(userInput){
    if (userInput != ""){
        // Fetching and parsing the local JSON file with the local pokemon list
        fetch('data/pokemon.json')
        .then(response => response.json())
        .then(data => {
            
            // Initialize Fuse.js
            let fuse = new Fuse(data.results, {
                keys: ['name'],
                includeScore: true,
                threshold: 0.3
            });

            // Perform a search
            let results = fuse.search(userInput);

            let promises = []; // To store all fetch promises
            searchResults.innerHTML =
            `
            <br>
            <hr>
            <h1>Results:</h1>
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Weight</th>
                        <th>Image</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
            `;
            for(const result of results){
                let pokemon = result.item;
                let pokemonName = pokemon.name;

                // Fetching the extra information from the API for the searched pokemons
                let fetchPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
                .then(response => response.json())
                .then(pokemonAPI => {
                    let row = document.createElement('tr');
                    row.innerHTML =
                    `
                        <td>${capitalizeFirstLetter(pokemonAPI.name)}</td>
                        <td>${pokemonAPI.weight} KG</td>
                        <td>
                            <img src="${pokemonAPI.sprites.front_default}"></img>
                            <img src="${pokemonAPI.sprites.back_default}"></img>
                        </td>
                        <td>
                            <a href="pokemon_details.html?name=${pokemonAPI.name}">
                            <img src="./data/info-icon.png" alt="info icon" style="width:45px;height:45px;"></img>
                            </a>
                        </td>
                    `;
                    searchResults.querySelector('tbody').appendChild(row);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
                promises.push(fetchPromise);
            }
            Promise.all(promises).then(() => {
                searchResults.innerHTML +="</tbody></table>";
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

