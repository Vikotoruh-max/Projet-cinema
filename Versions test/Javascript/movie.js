import { hasPoster, toLargePoster } from "./card.js";
import { fetchOmdb } from "./omdb.js";
import { initTopButton } from "./topButton.js";
import { recallPoster } from "./transition.js";

// Éléments de la page
const page = document.querySelector(".moviePage");
const detail = document.querySelector(".movieDetail");
const info = document.querySelector(".movieInfo");
const statusMessage = document.querySelector(".statusMessage");

// Film demandé dans l'adresse
const movieId = new URLSearchParams(window.location.search).get("id");

// Affiche affichée
let poster = null;

// Valeur utilisable ?
function isKnown(value) {
  return value && value !== "N/A";
}

// Crée un élément texte
function createText(tag, text, className = "") {
  if (!isKnown(text)) {
    return null;
  }

  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

// Affiche l'affiche du film
function showPoster(src) {
  poster = document.createElement("img");
  poster.className = "moviePoster";
  poster.alt = "Affiche du film";
  poster.src = src;
  detail.prepend(poster);

  page.style.setProperty("--posterImage", `url("${src}")`);
}

// Remplit les informations
function showInfo(movie) {
  document.title = `Cinéma — ${movie.Title}`;

  const meta = [movie.Year, movie.Runtime, movie.Genre, movie.Rated]
    .filter(isKnown)
    .join(" · ");

  const ratings = [
    isKnown(movie.imdbRating) && `★ ${movie.imdbRating} / 10 IMDb`,
    isKnown(movie.Metascore) && `Metascore ${movie.Metascore}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const facts = document.createElement("dl");
  facts.className = "movieFacts";

  [
    ["Réalisateur", movie.Director],
    ["Scénario", movie.Writer],
    ["Casting", movie.Actors],
    ["Sortie", movie.Released],
    ["Langue", movie.Language],
    ["Pays", movie.Country],
    ["Récompenses", movie.Awards],
    ["Box-office", movie.BoxOffice],
  ].forEach(([label, value]) => {
    if (isKnown(value)) {
      facts.append(createText("dt", label), createText("dd", value));
    }
  });

  const blocks = [
    createText("h1", movie.Title, "movieTitle"),
    createText("p", meta, "movieMeta"),
    createText("p", ratings, "movieMeta"),
    createText("p", movie.Plot, "moviePlot"),
    facts.children.length > 0 ? facts : null,
  ].filter(Boolean);

  // Apparition échelonnée
  blocks.forEach((block, index) => {
    block.style.setProperty("--fadeIndex", index);
  });

  info.replaceChildren(...blocks);
}

// Charge le film
async function loadMovie() {
  if (!movieId) {
    statusMessage.textContent =
      "Aucun film sélectionné. Retournez à l'accueil pour choisir un film.";
    return;
  }

  // Affiche déjà connue : pas d'attente
  const savedSrc = recallPoster(movieId);

  if (savedSrc) {
    showPoster(savedSrc);
  } else {
    statusMessage.textContent = "Chargement du film…";
  }

  try {
    const movie = await fetchOmdb({ i: movieId, plot: "full" });

    if (!poster && hasPoster(movie)) {
      showPoster(toLargePoster(movie.Poster));
    }

    if (poster) {
      poster.alt = `Affiche de ${movie.Title}`;
    }

    showInfo(movie);
    statusMessage.textContent = "";
  } catch (error) {
    console.error("Failed to load movie:", error);
    statusMessage.textContent =
      "Impossible de charger ce film. Vérifiez votre connexion puis réessayez.";
  }
}

initTopButton();
loadMovie();
