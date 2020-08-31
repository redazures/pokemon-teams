const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    get()
    clicker()   
});

function get(){
    fetch('http://localhost:3000/trainers')
    .then(res=>res.json())
    .then(string=>objectify(string))
}

function objectify(josh){ //console.log("you objectifying josh")
    josh.forEach(trainer=>render(trainer)) 
}
    
    // 
    //   <li>Zachariah (Ditto) <button class="release" data-pokemon-id="141">Release</button></li>
    //   <li>Mittie (Farfetch'd) <button class="release" data-pokemon-id="149">Release</button></li>
    //   <li>Rosetta (Eevee) <button class="release" data-pokemon-id="150">Release</button></li>
    //   <li>Rod (Beedrill) <button class="release" data-pokemon-id="151">Release</button></li>

function render(trainer){//console.log(`${trainer.id} ${trainer.name}`)
        
    const container = document.querySelector('main')
    const divP = document.createElement('div')
    divP.innerHTML=`<div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
    <button data-trainer-id="${trainer.id}" class='add'>Add Pokemon</button>
    <ul>
    </ul>
  </div>`
    container.appendChild(divP)
    //The above has create a trainer and the below needs to fill the container of UL with LI elements of pokemon
        
    trainer.pokemons.forEach(poke=>{//console.log(poke)
    const pokecontainer = divP.lastChild.lastElementChild
    const list = document.createElement('li')
    list.dataset.trainerId=`${trainer.id}`
    list.innerHTML=`${poke.nickname} ${poke.species} <button class="release" data-pokemon-id="${poke.id}">Release</button>`
    pokecontainer.appendChild(list)
    })
    
}

function clicker(){
    document.addEventListener('click',(e)=>{//console.log("i am clicking")
        if(e.target.matches('.add')){//console.log("this is the add button") //console.log(parseInt(e.target.dataset.trainerId))
            const trainerId = parseInt(e.target.dataset.trainerId)
            fetch('http://localhost:3000/pokemons', {
            method: "POST",
            headers: 
            {
                'Content-Type': 'application/json'
            }
            ,
            body: JSON.stringify({
                "trainer_id":trainerId
            })
            })
            .then(res => res.json())
            .then(poke=>{
            const pokecontainer = e.target.nextElementSibling //console.log(pokecontainer)
            const list = document.createElement('li')
            list.dataset.trainerId=`${trainerId}`
            list.innerHTML=`${poke.nickname} ${poke.species} <button class="release" data-pokemon-id="${poke.id}">Release</button>`
            pokecontainer.appendChild(list)
            })
        }
        // //The below is the release button
        if(e.target.matches('.release')){//console.log("this is the release button")
            const pokeId = parseInt(e.target.dataset.pokemonId)
            const trainerId = parseInt(e.target.parentElement.dataset.trainerId)
            const nickname = e.target.parentElement.textContent.split(" ")[0]
            const species = e.target.parentElement.textContent.split(" ")[1]

            faker ={
                "id":pokeId,
                "nickname":nickname,
                "species":species,
                "trainer_id":trainerId
            }

            console.log(faker)
            fetch('http://localhost:3000/pokemons/'+pokeId,{
            method: "DELETE" 
            }).then(resp => resp.url).then(console.log)

            e.target.parentElement.remove()
        }
    })
}
