console.log("App cargada correctamente");

const container = document.getElementById("pokemon-list");

async function getPokemonList(limit = 200) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await res.json();

  for (let poke of data.results) {
    const resPoke = await fetch(poke.url);
    const pokeData = await resPoke.json();
    renderPokemon(pokeData);
  }
}

function renderPokemon(pokemon) {
  const div = document.createElement("div");
  div.className = "pokemon-card";

  div.innerHTML = `
    <a href="detail.html?id=${pokemon.id}" style="text-decoration: none; color: inherit;">
      <h3>${pokemon.name.toUpperCase()}</h3>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
      <p>ID: ${pokemon.id}</p>
    </a>
  `;

  const actions = document.createElement("div");
  actions.className = "pokemon-actions";

  const favBtn = document.createElement("button");
  favBtn.className = "action-btn fav-btn";
  favBtn.textContent = "⭐ Favorito";
  favBtn.addEventListener("click", () => toggleFavorite(pokemon.name));

  const shareBtn = document.createElement("button");
  shareBtn.className = "action-btn share-btn";
  shareBtn.textContent = "📤 Compartir";
  shareBtn.addEventListener("click", () => {
    navigator.share({
      title: `Pokémon: ${pokemon.name}`,
      text: `Mirá este Pokémon: ${pokemon.name.toUpperCase()} (#${pokemon.id})`,
      url: window.location.href
    });
  });

  actions.appendChild(favBtn);
  actions.appendChild(shareBtn);
  div.appendChild(actions);

  container.appendChild(div);
}

function toggleFavorite(pokemonName) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.includes(pokemonName)) {
    favorites = favorites.filter(name => name !== pokemonName);
  } else {
    favorites.push(pokemonName);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// NOTA: Desactivamos temporalmente el Service Worker para evitar errores al correr localmente
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('✅ Service Worker registrado', reg.scope))
      .catch(err => console.error('❌ Error registrando el SW:', err));
  });
}
*/

// 🔍 Buscador
document.getElementById('search').addEventListener('input', function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const cards = document.querySelectorAll('.pokemon-card');

  cards.forEach(card => {
    const name = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = name.includes(searchTerm) ? 'block' : 'none';
  });
});

// 🌐 Estado de conexión
function updateConnectionStatus() {
  const status = document.getElementById('connection-status');
  if (!status) return;

  if (navigator.onLine) {
    status.textContent = "Estás conectado ✅";
    status.className = "online";
  } else {
    status.textContent = "Estás sin conexión ❌";
    status.className = "offline";
  }
}

window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);

// ⏳ Esperar a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  getPokemonList();
  updateConnectionStatus();
});
