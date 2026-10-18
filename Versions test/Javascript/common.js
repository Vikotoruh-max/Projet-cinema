// Clé API
const apiKey = "cb57f734";

// Affiches par rangée
const batchSize = 7;

// Bouton retour en haut
const topButton = document.querySelector(".topButton");

// Défilement
function scrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

// Recherche
async function fetchOmdb(params) {
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", apiKey);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.Response === "False") {
    throw new Error(data.Error || `Erreur HTTP : ${response.status}`);
  }

  return data;
}

// Affiche disponible ?
function hasPoster(movie) {
  return movie.Poster && movie.Poster !== "N/A";
}

// Version grande de l'affiche
function toLargePoster(url) {
  return url.replace(/_SX\d+/, "_SX700");
}

// Crée une carte de film
function createCard(movie, index) {
  const card = document.createElement("a");
  card.className = "movieCard";
  card.style.setProperty("--cardIndex", index);
  card.href = `movie.html?id=${encodeURIComponent(movie.imdbID)}`;
  card.setAttribute("aria-label", `Découvrir ${movie.Title}`);

  const largeUrl = toLargePoster(movie.Poster);

  const poster = document.createElement("img");
  poster.className = "poster";
  poster.alt = `Affiche de ${movie.Title}`;
  poster.src = largeUrl;

  // Retour à l'affiche originale
  poster.addEventListener(
    "error",
    () => {
      poster.src = movie.Poster;
    },
    { once: true },
  );

  card.style.setProperty("--posterImage", `url("${largeUrl}")`);
  card.appendChild(poster);

  return card;
}

// Attend le chargement de l'affiche
function waitForPoster(poster) {
  return new Promise((resolve) => {
    if (poster.complete && poster.naturalWidth > 0) {
      resolve();
      return;
    }
    poster.addEventListener("load", resolve, { once: true });
  });
}

// Crée une rangée de cartes
async function createRow(movies) {
  const row = document.createElement("div");
  row.className = "movieGallery";

  const cards = movies.map(createCard);
  row.append(...cards);

  // Au plus 5 secondes d'attente
  await Promise.race([
    Promise.all(
      cards.map((card) => waitForPoster(card.querySelector(".poster"))),
    ),
    new Promise((resolve) => setTimeout(resolve, 5000)),
  ]);

  return row;
}

// Visible après un défilement
function updateTopButton() {
  topButton.hidden = window.scrollY < window.innerHeight * 0.8;
}

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
});

window.addEventListener("scroll", updateTopButton, { passive: true });

updateTopButton();
