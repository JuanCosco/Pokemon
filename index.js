// ===========================================
// # 1. CONSUMIR LA POKEAPI
// ===========================================

const API_URL = "https://pokeapi.co/api/v2";
const pokemonList = document.getElementById("pokemon-list");
const typeSelect = document.getElementById("type-select");
const filterForm = document.getElementById("filter-form");

// ===========================================
// # 2. CARGAR TIPOS DE POKEMON (PARA EL FILTRO)
// ===========================================

async function loadTypes() {
  try {
    const response = await fetch(`${API_URL}/type`);
    const data = await response.json();

    console.log("Tipos disponibles:", data.results);

    // Llenamos el <select> con los tipos
    data.results.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.name;
      option.textContent = type.name.toUpperCase();
      typeSelect.append(option);
    });
  } catch (error) {
    console.error("Error cargando tipos:", error);
  }
}

// ===========================================
// # 3. CARGAR POKEMONES
//    - Si se envía un tipo, filtra por ese tipo
//    - Si no, carga los primeros 50 pokemones
// ===========================================

async function loadPokemons(type = "") {
  pokemonList.innerHTML = "<p>Cargando...</p>";
  let pokemons = [];

  try {
    if (type) {
      // Si se selecciona un tipo, pedimos los pokemones de ese tipo
      const response = await fetch(`${API_URL}/type/${type}`);
      const data = await response.json();
      pokemons = data.pokemon.map((p) => p.pokemon);
    } else {
      // Si no hay tipo, pedimos una lista general (limitada a 50)
      const response = await fetch(`${API_URL}/pokemon?limit=50`);
      const data = await response.json();
      pokemons = data.results;
    }

      console.log("Pokemones cargados:", pokemons); 

    // Enviamos la lista para mostrar en pantalla
    displayPokemons(pokemons);
  } catch (error) {
    console.error("Error cargando pokemones:", error);
  }
}

// ===========================================
// # 4. MOSTRAR LA LISTA DE POKEMONES EN PANTALLA
//    - Muestra nombre e imagen
// ===========================================

async function displayPokemons(pokemons) {
  pokemonList.innerHTML = "";

  for (const pokemon of pokemons) {
    try {
      const response = await fetch(pokemon.url);
      const data = await response.json();

      // Creamos la tarjeta del pokemon
      const card = document.createElement("div");
      card.classList.add("pokemon-card");
      card.innerHTML = `
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p>${data.name.toUpperCase()}</p>
      `;
      pokemonList.append(card);
    } catch (error) {
      console.error(`Error cargando datos de ${pokemon.name}:`, error);
    }
  }
}

// ===========================================
// # 5. EVENTO DEL FORMULARIO
//    - Escucha el envío del formulario para filtrar
// ===========================================

filterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const selectedType = formData.get("type-select"); // Obtenemos el tipo elegido
  loadPokemons(selectedType); // Llamamos a la función con el filtro
  console.log(formData);
});

// ===========================================
// # 6. INICIALIZACIÓN DEL PROYECTO
// ===========================================

loadTypes(); // Llenamos el select con los tipos
loadPokemons(); // Mostramos los primeros pokemones
