async function getPokemon(){
    //Captura el nombre del pokemon de la entrada.
    const pokeNameInput = document.getElementById("pokeName");
    let pokeName = pokeNameInput.value;
    pokeName = pokeName.toLowerCase();
    //Obtiene archivo del pokemon.
    const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
    //Realiza promesa de datos en general.
    let res = await fetch(url);
    let pokeData = await res.json();
    console.log(pokeData);
    //Imagen.
    let pokeImg = pokeData.sprites.front_default;
    //Nombre.
    pokeName=pokeData.name;
    //Id.
    let pokeID=pokeData.id;
    //Tipo. 
    //let pokeType=data.types[0].type.name; //Inglés
    //Accede al archivo de tipos para buscar el tipo en un idioma.
    res = await fetch(pokeData.types[0].type.url);
    let pokeType = await res.json();
    //Especie.
    res = await fetch(pokeData.species.url);
    let pokeSpecie = await res.json();
    //Descripcion
    let pokeDescription = pokeSpecie.flavor_text_entries;
    const _pokeDescription = pokeDescription.filter(
        (detail) => detail.language.name === "es");
    console.log(_pokeDescription[0].flavor_text.replace(/\n/g, " "));

    /*fetch(url)
        .then((res) => {
            if (res.status != "200") {
                console.log(res);
                pokeImage("./pokemon-sad.gif")
            }
            else {
                return res.json();
            }
        })
        .then((data) => {*/
    //Inserta la informacion en la pokedex.
    if (pokeData) {
        //Imagen.
        const _pokeImage = document.getElementById("pokeImg");
        _pokeImage.src = pokeImg;
        //Nombre
        const _pokeName=document.getElementById("pokeName");
        _pokeName.value=pokeName;
        //Id
        const _pokeID=document.getElementById("pokeNum");
        _pokeID.innerHTML=`No. ${pokeID}`;   
        //Tipo
        const _pokeType=document.getElementById("pokeType");
        _pokeType.innerHTML=`<p>Tipo:<br>${pokeType.names[5].name}<p>`;
        //Especie
        const _pokeSpecie=document.getElementById("rightScreen");
        _pokeSpecie.innerHTML=`<p>Especie: ${pokeSpecie.genera[5].genus}<p>`;

        let pokeString=pokeName+". Tipo: "+ pokeType.names[5].name+". Especie: "+pokeSpecie.genera[5].genus+". "+_pokeDescription[0].flavor_text.replace(/\n/g, " ");
        speak(pokeString);
        
    }
        //});
}

function speak(pokeString){
    //let voices = speechSynthesis.getVoices()[0];
    let message=new SpeechSynthesisUtterance;
    message.lang = 'es-US';
    message.text=pokeString;
    speechSynthesis.speak(message);
}
