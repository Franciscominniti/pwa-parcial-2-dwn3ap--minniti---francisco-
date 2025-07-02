async function getPokemonById(id) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return await res.json();
  }
  
  function renderDetail(pokemon) {
    const container = document.getElementById("pokemon-detail");
  
    container.innerHTML = `
      <div class="pokemon-card">
        <h2>${pokemon.name.toUpperCase()}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <p><strong>ID:</strong> ${pokemon.id}</p>
        <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
        <p><strong>Tipo:</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>
      </div>
    `;
  }
  
  function getIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }
  
  (async () => {
    const id = getIdFromURL();
    if (id) {
      const pokemon = await getPokemonById(id);
      renderDetail(pokemon);
    }
  })();