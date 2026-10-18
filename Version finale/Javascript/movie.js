import { hasPoster, toLargePoster } from "./card.js";
import { fetchOmdb } from "./omdb.js";
import { recallPoster } from "./transition.js";

// Éléments de la page
const page = document.querySelector(".moviePage");
const detail = document.querySelector(".movieDetail");
const info = document.querySelector(".movieInfo");
const statusMessage = document.querySelector(".statusMessage");

// Identifiant du film
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

// Affiche du film
let poster = null;

// Numéro du bloc affiché (sert à décaler l'apparition en fondu)
let blockCount = 0;

// Numéro des mois dans les dates anglaises
const monthNumbers = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

// Vérifier qu'OMDb a fourni une vraie valeur
function isKnown(value) {
  if (value && value !== "N/A") {
    return true;
  }
  return false;
}

// Convertir une date comme "14 Dec 2004" en "14/12/2004"
function formatFrenchDate(value) {
  if (isKnown(value) === false) {
    return null;
  }

  // Découper la date en jour, mois et année
  const parts = value.split(" ");
  let day = parts[0];
  const month = parts[1];
  const year = parts[2];

  // Format inattendu : afficher la valeur telle quelle
  if (!monthNumbers[month]) {
    return value;
  }

  // Ajouter un zéro devant les jours à un chiffre
  if (day.length === 1) {
    day = "0" + day;
  }

  return day + "/" + monthNumbers[month] + "/" + year;
}

// Assembler les valeurs connues avec un point
function joinKnown(values) {
  const knownValues = [];
  for (let i = 0; i < values.length; i++) {
    if (isKnown(values[i])) {
      knownValues.push(values[i]);
    }
  }
  return knownValues.join(" · ");
}

// Ajouter un texte dans les informations (et éviter des injections de code par la même occasion)
function addText(tag, text, className) {
  if (isKnown(text) === false) {
    return;
  }

  // textContent insère du texte brut
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;

  // Décaler l'apparition de chaque bloc
  element.style.setProperty("--fadeIndex", blockCount);
  blockCount++;

  info.appendChild(element);
}

// Ajouter un détail (titre + valeur) dans la liste
function addFact(list, label, value) {
  if (isKnown(value) === false) {
    return;
  }

  const term = document.createElement("dt");
  term.textContent = label;

  const description = document.createElement("dd");
  description.textContent = value;

  list.appendChild(term);
  list.appendChild(description);
}

// Afficher l'affiche du film à gauche
function showPoster(src) {
  poster = document.createElement("img");
  poster.className = "moviePoster";
  poster.alt = "Affiche du film";
  poster.src = src;
  detail.insertBefore(poster, detail.firstChild);

  // La même image sert de lueur floue en arrière-plan
  page.style.setProperty("--posterImage", 'url("' + src + '")');
}

// Afficher les informations du film à droite
function showInfo(movie) {
  document.title = "Les Amphis — " + movie.Title;

  // Année, durée, genres, classification
  const meta = joinKnown([movie.Year, movie.Runtime, movie.Genre, movie.Rated]);

  // Notation
  let imdbText = "";
  if (isKnown(movie.imdbRating)) {
    imdbText = "★ " + movie.imdbRating + " / 10 IMDb";
  }
  let metascoreText = "";
  if (isKnown(movie.Metascore)) {
    metascoreText = "Metascore " + movie.Metascore;
  }
  const ratings = joinKnown([imdbText, metascoreText]);

  // Repartir de zéro
  info.innerHTML = "";
  blockCount = 0;

  // Afficher les textes dans l'ordre
  addText("h1", movie.Title, "movieTitle");
  addText("p", meta, "movieMeta");
  addText("p", ratings, "movieMeta");
  addText("p", movie.Plot, "moviePlot");

  // Détails du film
  const facts = document.createElement("dl");
  facts.className = "movieFacts";
  addFact(facts, "Réalisateur", movie.Director);
  addFact(facts, "Scénario", movie.Writer);
  addFact(facts, "Casting", movie.Actors);
  addFact(facts, "Sortie cinéma", formatFrenchDate(movie.Released));
  addFact(facts, "Sortie DVD", formatFrenchDate(movie.DVD));
  addFact(facts, "Langue", movie.Language);
  addFact(facts, "Pays", movie.Country);
  addFact(facts, "Récompenses", movie.Awards);
  addFact(facts, "Box-office", movie.BoxOffice);

  // Afficher la liste seulement si elle contient au moins un détail
  if (facts.children.length > 0) {
    facts.style.setProperty("--fadeIndex", blockCount);
    info.appendChild(facts);
  }
}

// Charger et afficher le film demandé
async function loadMovie() {
  // Sans identifiant dans l'adresse, rien à charger
  if (!movieId) {
    statusMessage.textContent =
      "Aucun film sélectionné. Retournez à l'accueil pour choisir un film.";
    return;
  }

  // Si l'affiche cliquée est connue, l'afficher tout de suite
  const savedSrc = recallPoster(movieId);

  if (savedSrc) {
    showPoster(savedSrc);
  } else {
    statusMessage.textContent = "Chargement du film…";
  }

  try {
    // Demander tous les détails du film
    const movie = await fetchOmdb({ i: movieId, plot: "full" });

    // Prendre l'affiche d'OMDb sauf si elle est déjà mémorisée
    if (!poster && hasPoster(movie)) {
      showPoster(toLargePoster(movie.Poster));
    }

    // Compléter le texte de l'affiche avec le titre
    if (poster) {
      poster.alt = "Affiche de " + movie.Title;
    }

    showInfo(movie);
    statusMessage.textContent = "";
  } catch (error) {
    console.error("Failed to load movie:", error);
    statusMessage.textContent =
      "Impossible de charger ce film. Vérifiez votre connexion puis réessayez.";
  }
}

loadMovie();
