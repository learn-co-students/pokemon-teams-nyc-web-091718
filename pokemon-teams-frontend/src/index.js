
document.addEventListener('DOMContentLoaded', (event) => {

  const BASE_URL = "http://localhost:3000"
  const TRAINERS_URL = `${BASE_URL}/trainers`
  const POKEMONS_URL = `${BASE_URL}/pokemons`
  let ourPokemons = [];

console.log("DOM fully loaded and parsed");

let allTrainers = []
const container = document.getElementById('allpokemon')

fetch('http://localhost:3000/trainers')
.then((response) => response.json())
    .then((json) => {
      allTrainers = json
      container.innerHTML = firstRender(allTrainers)
    })






document.addEventListener('click', (event) => {

  if(event.target.dataset.action === "add") {

    fetch(POKEMONS_URL,
    {
      method: 'POST',
      body: JSON.stringify({
        "trainer_id": event.target.dataset.id
      }), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then(function(response) {
          console.log( response );
          pokeList = document.getElementById("poke-list-"+response.trainer_id)
          pokeList.innerHTML += renderPokemon(response)
      })

  } else if (event.target.dataset.action === "release") {
    fetch(POKEMONS_URL+'/'+event.target.dataset.id,
    {
      method: 'DELETE',
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then(function(response) {
        pokemon = document.getElementById(response.id)
        pokemon.parentNode.removeChild(pokemon)
      })

  }

})

}) //END DOM LISTENER

function firstRender(trainers) {
  return trainers.map((trainer) => {

    html = `
    <div class="card" data-id="1"><p>${trainer.name}</p>
  <button data-action="add" data-id="${trainer.id}">Add Pokemon</button>
  <ul id= "poke-list-${trainer.id}">`

    for ( i=0; i<trainer.pokemons.length; i++ ) {
    html += renderPokemon(trainer.pokemons[i])
  }

    html += `
  </ul>
</div>
    `
    return html
  }).join(' ')

}

function renderPokemon(pokemon) {
  return `<li id="${pokemon.id}">${pokemon.nickname} (${pokemon.species}) <button data-action="release" data-id="${pokemon.id}">Release</button></li>`

}
