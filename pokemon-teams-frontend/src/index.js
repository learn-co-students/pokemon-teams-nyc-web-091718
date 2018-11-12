const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', () => {
  const trainerContainer = document.querySelector('main')
  const trainersPokeHolder = document.createElement('ul')
  let allPokemon
  let allTrainers
  let trainerId
  let pokeId

  // Initial Fetch
  fetch(TRAINERS_URL)
    .then(resp => resp.json())
    .then(trainersData => {
      allTrainers = trainersData
      allTrainers.forEach(trainer => {
        // let trainersPokeTeam = trainersPokemon(trainer)
        trainerContainer.innerHTML += renderTrainerCard(trainer)

      }) // end of forEach
    }) // end of fetch


  trainerContainer.addEventListener('click', (event) => {
    // debugger
    if(event.target.innerText == "Add Pokemon") {
        trainerId = event.target.dataset.trainerId
        let trainer = findTrainer(trainerId)

        if (trainer.pokemons.length >= 6) {
          alert(`${trainer.name} already has 6 pokemon. Release one to add a new one.`)
        } else {
          addPokemon(trainer)
          console.log(trainer.pokemons.length)
        }

    } else if (event.target.innerText == "Release") {
        pokeId = event.target.dataset.pokemonId
        trainerId = event.target.dataset.trainerId
        releasePokemon(pokeId, trainerId)
    }
  }) // end of container listener

  function trainersPokemon(trainer) {
    trainersPokeHolder.innerHTML = ""

    trainer.pokemons.forEach(pokemon => {
      trainersPokeHolder.innerHTML += `
        <li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-trainer-id="${trainer.id}" data-pokemon-id="${pokemon.id}">Release</button></li>
      `
    }) // end of forEach
    // debugger
    return trainersPokeHolder
  } // end of trainersPokemon

  function renderTrainerCard(trainer) {
    return `
      <div class="card" data-id="${trainer.id}">
      <p>${trainer.name}</p>
        <button data-trainer-id="${trainer.id}">Add Pokemon</button>
        <ul>
        ${(trainersPokemon(trainer)).innerHTML}
        </ul>
      </div>
      `
  }

  function releasePokemon(pokeId, trainerId) {
    let trainer = findTrainer(trainerId)
    // remove from DOM
    let trainerRow = Array.from(trainerContainer.children).find(row => (row.dataset.id == trainer.id)).querySelector('ul')
      // console.log(trainerRow)
      // // debugger
      // trainerRow.innerHTML += `
      //   <li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-trainer-id="${trainer.id}" data-pokemon-id="${pokemon.id}">Release</button></li>
      // `
      // trainer.pokemons.push({
      //   "id": pokemon.id,
      //   "nickname": pokemon.nickname,
      //   "species": pokemon.species,
      //   "trainer_id": trainer.id
      // })

    // remove from server
    fetch(`http://localhost:3000/pokemons/${pokeId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
      })

  } // end of releasePokemon

  function addPokemon(trainer) {
    fetch(`POKEMONS_URL`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ trainer_id: trainer.id })
      }).then(resp => resp.json())
      .then(pokemon => {
        let trainerRow = Array.from(trainerContainer.children).find(row => (row.dataset.id == trainer.id)).querySelector('ul')
        console.log(trainerRow)
        // debugger
        trainerRow.innerHTML += `
          <li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-trainer-id="${trainer.id}" data-pokemon-id="${pokemon.id}">Release</button></li>
        `
        trainer.pokemons.push({
          "id": pokemon.id,
          "nickname": pokemon.nickname,
          "species": pokemon.species,
          "trainer_id": trainer.id
        })
      })
  } // end of addPokemon

  function findTrainer(trainerId) {
    return allTrainers.find(trainer => (trainerId == trainer.id))
  }

}) // end of DOMContentLoaded
