import { fetchOmdb } from "./omdb.js";
import { keepLoadablePosters } from "./card.js";
import { createRow } from "./row.js";
import { initTopButton } from "./topButton.js";
import { batchSize } from "./config.js";
import { scrollBehavior } from "./scroll.js";

// Délai d'attente après la dernière frappe avant de chercher
const searchDelay = 150;

// Éléments de la page
const searchInput = document.querySelector(".searchInput");
const rowsContainer = document.querySelector(".movieRows");
const moreButton = document.querySelector(".moreButton");
const statusMessage = document.querySelector(".statusMessage");

// Texte d'origine du bouton
const buttonLabel = moreButton.textContent.trim();

// État de la recherche en cours
let query = ""; // texte recherché
let foundMovies = []; // films trouvés
let shownCount = 0; // nombre de films affichés
let nextPage = 1; // prochaine page OMDb
let totalPages = 0; // nombre total de pages
let searchNumber = 0; // numéro de la recherche
let searchTimer; // délai après clavier

// Traduire une erreur OMDb en message français
function getErrorText(error) {
  if (error.message === "Movie not found!") {
    return "Aucun film trouvé.";
  }
  if (error.message === "Too many results.") {
    return "Trop de résultats : précisez votre recherche.";
  }
  return "Impossible de charger les films (" + error.message + ").";
}

// Effacer les résultats pour repartir d'une recherche vide
function resetSearch() {
  // Un nouveau numéro rend caduques les requêtes encore en cours
  searchNumber++;

  foundMovies = [];
  shownCount = 0;
  nextPage = 1;
  totalPages = 0;

  rowsContainer.innerHTML = "";
  statusMessage.textContent = "";
  moreButton.hidden = true;
  moreButton.disabled = false;
}

// Charger des pages de résultats
async function fillFoundMovies(target, mySearchNumber) {
  // Continuer tant qu'il manque des films et qu'il reste des pages
  while (
    foundMovies.length < target &&
    (nextPage === 1 || nextPage <= totalPages)
  ) {
    // Demander une page de résultats
    const data = await fetchOmdb({ s: query, type: "movie", page: nextPage });

    // Ignorer la réponse si la recherche a changé entre-temps
    if (mySearchNumber !== searchNumber) {
      return;
    }

    // Retenir le nombre total de pages (10 résultats par page)
    totalPages = Math.ceil(Number(data.totalResults) / 10);
    nextPage++;

    // Garder les films dont l'affiche se charge
    const loadableMovies = await keepLoadablePosters(data.Search);

    // Vérifier si la recherche a pu changer pendant le test des images
    if (mySearchNumber !== searchNumber) {
      return;
    }

    for (let i = 0; i < loadableMovies.length; i++) {
      foundMovies.push(loadableMovies[i]);
    }
  }
}

// Afficher la rangée suivante de résultats
async function showBatch() {
  // Numéro de la recherche à laquelle appartient ce chargement
  const mySearchNumber = searchNumber;
  const isFirstBatch = shownCount === 0;

  // Désactiver le bouton pendant le chargement
  moreButton.disabled = true;
  moreButton.textContent = "Chargement…";
  if (isFirstBatch) {
    statusMessage.textContent = "Recherche en cours…";
  } else {
    statusMessage.textContent = "";
  }

  try {
    // Vérifier s'il reste plus de films en en chargeant un de plus
    await fillFoundMovies(shownCount + batchSize + 1, mySearchNumber);

    // Abandonner si une nouvelle recherche a pris le relais
    if (mySearchNumber !== searchNumber) {
      return;
    }

    // Prendre les films de la rangée et les compter comme affichés
    const movies = foundMovies.slice(shownCount, shownCount + batchSize);
    shownCount += movies.length;

    // Ajouter la rangée s'il y a au moins un film
    if (movies.length > 0) {
      const row = createRow(movies);
      rowsContainer.appendChild(row);

      // Après la première rangée, centrer la nouvelle rangée à l'écran
      if (isFirstBatch === false) {
        row.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      }
    }

    // Message si rien n'a été trouvé
    if (shownCount === 0) {
      statusMessage.textContent = "Aucun film trouvé.";
    } else {
      statusMessage.textContent = "";
    }

    // Bouton apparaît seulement s'il reste des films à afficher
    moreButton.hidden = shownCount >= foundMovies.length;
    moreButton.textContent = buttonLabel;
  } catch (error) {
    // N'afficher l'erreur que si la recherche est toujours la bonne
    if (mySearchNumber === searchNumber) {
      console.error("Failed to load movies:", error);
      statusMessage.textContent = getErrorText(error);

      // Si erreur, bouton réessayer
      moreButton.hidden = shownCount === 0;
      moreButton.textContent = "Réessayer";
    }
  } finally {
    // Réactiver le bouton
    if (mySearchNumber === searchNumber) {
      moreButton.disabled = false;
    }
  }
}

// Lancer une recherche avec le texte saisi
function runSearch() {
  resetSearch();
  query = searchInput.value.trim();

  // Ne pas effectuer de recherche avec un champ vide
  if (query !== "") {
    showBatch();
  }
}

// Attendre la fin de la saisie avant de chercher
searchInput.addEventListener("input", function () {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(runSearch, searchDelay);
});

// Cliquer sur le bouton charge la rangée suivante
moreButton.addEventListener("click", showBatch);

initTopButton();
