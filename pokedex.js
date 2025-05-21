const _pokeRightScreen=document.getElementById("rightScreen");
const _pokeImage = document.getElementById("pokeImg");
const _pokeID=document.getElementById("pokeNum");
const _pokeType=document.getElementById("pokeType");
const _pokeName=document.getElementById("pokeName");
const pokeNameInput = document.getElementById("pokeName");
//Para apertura de cámara.
let but = document.getElementById("but");
const _pokeScreen = document.getElementById("pokeScreen");
let mediaDevices = navigator.mediaDevices;

let pokeDescription;
const synth = window.speechSynthesis;
let message=new SpeechSynthesisUtterance;
message.lang = 'es-US';
let currentPokemon=25;
let pokeString="Sin datos para repetir.";
let pokeIntroduction="Datos no disponibles.";
let pokeDescriptions=["Datos no disponibles.","Datos no disponibles.","Datos no disponibles.","Datos no disponibles."];

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceWorker.js')
      .then(reg => console.log('Service Worker registrado', reg))
      .catch(err => console.warn('Error al registrar Service Worker', err))
}

async function getPokemon(){
    //Captura el nombre del pokemon de la entrada.
    let pokeName = pokeNameInput.value;
    pokeName = pokeName.toLowerCase();
    if (synth.speaking) {
        synth.cancel();
    }
    //Apaga luz roja de error.
    offRedLightError();
    //Obtiene archivo del pokemon.
    try{
        const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
        //Realiza promesa de datos en general.
        let res = await fetch(url);
        let pokeData = await res.json();
        console.log(pokeData);
        //Imagen.
        let pokeImg = pokeData.sprites.other["official-artwork"].front_default;
        //Nombre.
        pokeName=pokeData.name;
        //Id.
        let pokeID=pokeData.id;
        currentPokemon=pokeID;
        //Tipo. 
        //let pokeType=data.types[0].type.name; //Inglés
        //Accede al archivo de tipos para buscar el tipo en un idioma.
        res = await fetch(pokeData.types[0].type.url);
        let pokeType = await res.json();
        //Especie.
        res = await fetch(pokeData.species.url);
        let pokeSpecie = await res.json();
        //Descripcion.
        pokeDescription = pokeSpecie.flavor_text_entries;
        const _pokeDescription = pokeDescription.filter(
            (detail) => detail.language.name === "es");
        pokeDescriptions[0]=_pokeDescription[0].flavor_text.replace(/\n/g, " ");
        try{
            pokeDescriptions[1]=_pokeDescription[1].flavor_text.replace(/\n/g, " ");
            pokeDescriptions[2]=_pokeDescription[2].flavor_text.replace(/\n/g, " ");
            pokeDescriptions[3]=_pokeDescription[3].flavor_text.replace(/\n/g, " ");
        }
        catch(e){
            console.log("Descripcion no encontrada");
            pokeDescriptions[2]="";
            pokeDescriptions[3]="";
        }
        //console.log(_pokeDescription[1].flavor_text.replace(/\n/g, " "));
        //Peso.
        let pokeWeight=pokeData.weight*0.1;
        //Altura.
        let pokeHeight=pokeData.height*0.1;
        //Habilidades.
        let pokeAbilities;
        let pokeAbilitesLength=pokeData.abilities.length;
        if(pokeAbilitesLength==1){
            //Solo tiene una habilidad.
            res = await fetch(pokeData.abilities[0].ability.url);
            pokeAbilities=[await res.json()];
        }
        else{
            //Tiene dos habilidades.
            res = await fetch(pokeData.abilities[0].ability.url);
            pokeAbilities=[await res.json()];
            res = await fetch(pokeData.abilities[1].ability.url);
            pokeAbilities.push(await res.json());
        }

        //Inserta la informacion en la pokedex.
        //Imagen.
        _pokeImage.src = pokeImg;
        //Nombre.
        _pokeName.value=pokeName;
        //Id.
        _pokeID.innerHTML=`<p>No. ${pokeID}</p>`;   
        //Tipo.
        _pokeType.innerHTML=`<p>Tipo:<br>&nbsp&nbsp${pokeType.names[5].name}</p>`;
        //Especie, peso, altura y habilidades.
        if(pokeAbilitesLength==1){
            //Solo tiene una habilidad.
            _pokeRightScreen.innerHTML=`<p>Especie: ${pokeSpecie.genera[5].genus}.<br>
                Peso: ${pokeWeight.toFixed(2)} kg.<br>
                Altura: ${pokeHeight.toFixed(2)} m.<br>
                Habilidades:<br>
                &nbsp&nbsp&nbsp*${pokeAbilities[0].names[5].name}</p>`;
        }
        else{
            //Tiene dos habilidades.
            _pokeRightScreen.innerHTML=`<p>Especie: ${pokeSpecie.genera[5].genus}.<br>
                Peso: ${pokeWeight.toFixed(2)} kg.<br>
                Altura: ${pokeHeight.toFixed(2)} m.<br>
                Habilidades:<br>
                &nbsp&nbsp&nbsp*${pokeAbilities[0].names[5].name}<br>
                &nbsp&nbsp&nbsp*${pokeAbilities[1].names[5].name}</p>`;
        }

        //Se invoca al narrador.
        pokeIntroduction=pokeName+". Tipo: "+ pokeType.names[5].name+". Especie: "+pokeSpecie.genera[5].genus+". "
            +pokeDescriptions[0];
        pokeString=pokeIntroduction;
        speak(pokeString);  
    }
    catch(error){
        console.log("Error: "+error);
        _pokeRightScreen.innerHTML=`<p>Ha ocurrido un error.<br><br>
            Verifique que el nombre del pokémon esté bien escrito o introduzca un número entre 1 y 898.</p>`;
        _pokeImage.src="Images/squirtle-crying.gif";
        _pokeID.innerText="";
        _pokeType.innerText="";
        _pokeImage.src="Images/squirtle-crying.gif";
        pokeString="Sin datos para repetir."
        pokeIntroduction="Datos no disponibles.";
        onRedLightError();
    }
}

function speak(pokeSpeak){
    message.text=pokeSpeak;
    //Detiene al narrador en caso de que este hablando.
    if (synth.speaking) {
        synth.cancel();
    }
    synth.speak(message);
    message.onstart = () => {
        onBlinkBlueLight();
    };
    message.onend = () => {
        offBlinkBlueLight();
    };        
}

//Detiene al narrador al recargar la página.
document.addEventListener("DOMContentLoaded", (e) => {
    synth.cancel();
});
//Hace parpadear al led azul.
function onBlinkBlueLight(){
    const blueLight=document.getElementById("blueLight");
    blueLight.classList.add("blinkBlueLight");
}
//El led azul deja de parpadear.
function offBlinkBlueLight(){
    const blueLight=document.getElementById("blueLight");
    blueLight.classList.remove("blinkBlueLight");
}
//Prende el led rojo de error.
function onRedLightError(){
    const redLightError=document.getElementById("redLightError");
    redLightError.classList.add("redCircle3LightOn");
}
//Apaga el led rojo de error.
function offRedLightError(){
    const redLightError=document.getElementById("redLightError");
    redLightError.classList.remove("redCircle3LightOn");
}
//Elige un pokemon de entre 898 al azar para buscar.
function pokeRandom(){
    _pokeName.value=Math.floor(Math.random() * 898)+ 1;
    getPokemon();
}
//Busca al pokemon siguiente.
function nextPokemon(){
    _pokeName.value=currentPokemon+1;
    getPokemon();
}
//Busca al anterior Pokemon.
function previousPokemon(){
    _pokeName.value=currentPokemon-1;
    getPokemon();
}
//Detiene al narrdor.
function stopSpeaking(){
    synth.cancel();
}
//Repite lo último dicho por el narrador.
function repeatSpeaking(){
    speak(pokeString);
}
//Reproduce una de las descripciones del pokemon.
function playPokeDescription(index){
        pokeString=pokeDescriptions[index];
        speak(pokeString);
}
//Permite buscar un pokemon al teclear enter.
pokeNameInput.addEventListener("keydown", function(event) {
    if (event.which == 13) {
        getPokemon();
    }
});