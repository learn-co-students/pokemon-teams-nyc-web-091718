const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
let trainersArray = [];
const mainContainer = document.getElementById('trainers-container');

// on load fetch
  fetch(TRAINERS_URL)
  .then(resp => resp.json())
  .then(trainersJSON => {
    trainersArray = trainersJSON;
    mainContainer.innerHTML = renderAllTrainers(trainersArray);
  })

// event listeners
mainContainer.addEventListener('click', mainEventHandler)


// helper functions
function renderAllTrainers(array) {
  return array.map(trainer => renderSingleTrainer(trainer)).join('');
}

function renderSingleTrainer(trainer) {
  return `
  <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
  <button data-trainer-id="${trainer.id}">Add Pokemon</button>
  <ul id="pokes-${trainer.id}">
    ${renderPokeLi(trainer.pokemons)}
  </ul>
  </div>
  `
}

function renderPokeLi(array) {
  return array.map(pokemon => {
    return `
      <li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>
    `
  }).join('')
}

function mainEventHandler(event) {
  // console.log(trainersArray);
  // console.log(event.target);
  // debugger
  if (event.target.dataset.trainerId != undefined) {
    const tId = event.target.dataset.trainerId;
    const tIndex = trainersArray.findIndex(t => t.id == tId);
    const targetTrainer = trainersArray[tIndex];
    let pokeNum = targetTrainer.pokemons.length;
    if (pokeNum < 6) {
      fetch(POKEMONS_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({trainer_id: targetTrainer.id})
      })
        .then(resp => resp.json())
        .then(newPoke =>{
          const targetPokeUl = document.getElementById(`pokes-${targetTrainer.id}`);
          targetTrainer.pokemons.push(newPoke);
          targetPokeUl.innerHTML = renderPokeLi(targetTrainer.pokemons)
        })
    } // ck if trainer has less than 6 pokemon before fetch post
  } // ck for addPokemon button if stmt

  if (event.target.className === 'release') {
    const tId = event.target.parentElement.parentElement.parentElement.dataset.id;
    const pId = parseInt(event.target.dataset.pokemonId);
    const tIndex = trainersArray.findIndex(t => t.id == tId);
    const targetTrainer = trainersArray[tIndex];
    const pIndex = targetTrainer.pokemons.findIndex(p => p.id == pId);
    const targetPokemon = targetTrainer.pokemons[pIndex];

    fetch(`${POKEMONS_URL}/${pId}`, {method: 'DELETE'})
      .then(resp => {
        if (resp.ok) {
          const targetPokeUl = document.getElementById(`pokes-${targetTrainer.id}`);
          targetTrainer.pokemons.splice(pIndex, 1);
          trainersArray[tIndex] = targetTrainer;
          targetPokeUl.innerHTML = renderPokeLi(targetTrainer.pokemons);
        }
      })
  } // ck for release button if stmt
} // end mainEventHandler helper fn
