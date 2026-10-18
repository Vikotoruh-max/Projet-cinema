import { fetchOmdb } from "./omdb.js";
import { keepLoadablePosters } from "./card.js";
import { createRow } from "./row.js";
import { initTopButton } from "./topButton.js";
import { batchSize } from "./config.js";
import { movieIds } from "./movieIds.js";
import { scrollBehavior } from "./scroll.js";
import { shuffle } from "./shuffle.js";

// Éléments de la page
const rowsContainer = document.querySelector(".movieRows");
const moreButton = document.querySelector(".moreButton");
const statusMessage = document.querySelector(".statusMessage");

// Texte d'origine du bouton
const buttonLabel = moreButton.textContent.trim();

// Liste des films mélangée
const queue = shuffle(movieIds);
let cursor = 0;

// Dernière erreur rencontrée en chargeant un film
let lastError = null;

// Récupérer un film grâce à son identifiant
async function getMovie(id) {
  try {
    const movie = await fetchOmdb({ i: id });
    return movie;
  } catch (error) {
    console.error("Movie not loaded:", error);
    lastError = error;
    return null;
  }
}

// Charger un lot de films
async function loadBatch() {
  const batch = [];

  // Continuer tant qu'il manque des films
  while (batch.length < batchSize && cursor < queue.length) {
    // Prendre autant d'identifiants qu'il manque de films
    const ids = queue.slice(cursor, cursor + (batchSize - batch.length));
    cursor += ids.length;

    // Interroger OMDb pour tous les identifiants en même temps
    const requests = [];
    for (let i = 0; i < ids.length; i++) {
      requests.push(getMovie(ids[i]));
    }
    const results = await Promise.all(requests);

    // Séparer les réussites des échecs
    const movies = [];
    let failedCount = 0;
    for (let i = 0; i < results.length; i++) {
      if (results[i] === null) {
        failedCount++;
      } else {
        movies.push(results[i]);
      }
    }

    // Arrêt si toutes les requêtes échouent
    if (failedCount === results.length) {
      throw lastError;
    }

    // Garder seulement les films dont l'affiche se charge
    const goodMovies = await keepLoadablePosters(movies);
    for (let i = 0; i < goodMovies.length; i++) {
      batch.push(goodMovies[i]);
    }
  }

  return batch;
}

// Ajouter une rangée d'affiches à la page
async function showBatch() {
  const isFirstLoad = rowsContainer.children.length === 0;

  // Désactiver le bouton pendant le chargement
  moreButton.disabled = true;
  moreButton.textContent = "Chargement…";
  statusMessage.textContent = "";

  // Signaler le chargement aux lecteurs d'écran
  rowsContainer.setAttribute("aria-busy", "true");

  try {
    const movies = await loadBatch();

    // Ajouter la rangée s'il y a au moins un film
    if (movies.length > 0) {
      const row = createRow(movies);
      rowsContainer.appendChild(row);

      // Centrer la nouvelle rangée à l'écran
      if (isFirstLoad === false) {
        row.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      }
    }

    // Cacher le bouton quand la liste est épuisée
    if (cursor >= queue.length) {
      moreButton.hidden = true;
      statusMessage.textContent = "Tous les films ont été affichés.";
    } else {
      moreButton.hidden = false;
      moreButton.textContent = buttonLabel;
    }
  } catch (error) {
    // Afficher l'erreur
    console.error("Failed to load movies:", error);
    statusMessage.textContent =
      "Impossible de charger les films (" + error.message + ").";
    moreButton.hidden = false;
    moreButton.textContent = "Réessayer";
  } finally {
    // Réactiver le bouton
    moreButton.disabled = false;
    rowsContainer.setAttribute("aria-busy", "false");
  }
}

// Charger le lot suivant
moreButton.addEventListener("click", showBatch);

initTopButton();
showBatch();
