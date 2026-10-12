import { fetchOmdb } from "./omdb.js";
import { hasPoster } from "./card.js";
import { createRow } from "./row.js";
import { initTopButton } from "./topButton.js";
import { batchSize } from "./config.js";
import { scrollBehavior } from "./scroll.js";

// Délai avant recherche (ms)
const searchDelay = 300;

// Éléments de la page
const searchInput = document.querySelector(".searchInput");
const rowsContainer = document.querySelector(".movieRows");
const moreButton = document.querySelector(".moreButton");
const statusMessage = document.querySelector(".statusMessage");

// Libellé initial du bouton
const buttonLabel = moreButton.textContent.trim();

// État de la recherche
let query = "";
let foundMovies = [];
let shownCount = 0;
let nextPage = 1;
let totalPages = 0;
let searchToken = 0;
let searchTimer;

// Message d'erreur lisible
function getErrorText(error) {
  if (error.message === "Movie not found!") {
    return "Aucun film trouvé.";
  }
  if (error.message === "Too many results.") {
    return "Trop de résultats : précisez votre recherche.";
  }
  return `Impossible de charger les films (${error.message}).`;
}

// Remet la recherche à zéro
function resetSearch() {
  searchToken++;
  foundMovies = [];
  shownCount = 0;
  nextPage = 1;
  totalPages = 0;
  rowsContainer.replaceChildren();
  statusMessage.textContent = "";
  moreButton.hidden = true;
  moreButton.disabled = false;
}

// Charge des films jusqu'à l'objectif
async function fillFoundMovies(target, token) {
  while (
    foundMovies.length < target &&
    (nextPage === 1 || nextPage <= totalPages)
  ) {
    const data = await fetchOmdb({ s: query, type: "movie", page: nextPage });

    // Recherche changée entre-temps
    if (token !== searchToken) {
      return;
    }

    totalPages = Math.ceil(Number(data.totalResults) / 10);
    nextPage++;
    foundMovies.push(...data.Search.filter(hasPoster));
  }
}

// Ajoute une rangée de résultats
async function showBatch() {
  const token = searchToken;
  const isFirstBatch = shownCount === 0;

  moreButton.disabled = true;
  moreButton.textContent = "Chargement…";
  statusMessage.textContent = isFirstBatch ? "Recherche en cours…" : "";

  try {
    // Un film d'avance
    await fillFoundMovies(shownCount + batchSize + 1, token);

    if (token !== searchToken) {
      return;
    }

    const movies = foundMovies.slice(shownCount, shownCount + batchSize);
    shownCount += movies.length;

    if (movies.length > 0) {
      const row = await createRow(movies);

      if (token !== searchToken) {
        return;
      }

      rowsContainer.append(row);

      if (!isFirstBatch) {
        row.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      }
    }

    statusMessage.textContent =
      shownCount === 0 ? "Aucun film trouvé." : "";
    moreButton.hidden = shownCount >= foundMovies.length;
    moreButton.textContent = buttonLabel;
  } catch (error) {
    if (token === searchToken) {
      console.error("Failed to load movies:", error);
      statusMessage.textContent = getErrorText(error);
      moreButton.hidden = shownCount === 0;
      moreButton.textContent = "Réessayer";
    }
  } finally {
    if (token === searchToken) {
      moreButton.disabled = false;
    }
  }
}

// Lance la recherche en direct
function runSearch() {
  resetSearch();
  query = searchInput.value.trim();

  if (query) {
    showBatch();
  }
}

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(runSearch, searchDelay);
});

moreButton.addEventListener("click", showBatch);

initTopButton();
