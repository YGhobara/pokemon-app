// Fetching pokemon name from the URL
const urlParams = new URLSearchParams(window.location.search);
const pokemonName = urlParams.get('name');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Fetching the pokemon's data from the API
fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
.then(response => response.json())
.then(pokemonAPI => {
    console.log(pokemonAPI);
    document.getElementById('pokemonName').textContent = capitalizeFirstLetter(pokemonAPI.name);
    document.getElementById('pokemonImage').src = pokemonAPI.sprites.front_default;
    return fetch(pokemonAPI.species.url);
})
.then(response => response.json())
.then(speciesAPI => {
    // French Description from another API
    const flavorText = speciesAPI.flavor_text_entries.find(entry => entry.language.name === 'fr');
    const pokemonDescription = document.createElement('p');
    pokemonDescription.innerHTML = "<h3>"+flavorText.flavor_text+"</h3>";
    document.body.appendChild(pokemonDescription);
})
.catch(error => {
    console.error('Error:', error);
});
