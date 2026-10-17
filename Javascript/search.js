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

//on remet la recherche à zéro
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

//on remplit le tableau foundMovies avec les films trouvés
async function fillFoundMovies(target, token) {
//on continue de charger des films tant qu'il reste des pages à récupérer
  while (
    foundMovies.length < target &&
    (nextPage === 1 || nextPage <= totalPages)
  ) {
//on cherche les films en lien avec la requête actuelle
    const data = await fetchOmdb({ s: query, type: "movie", page: nextPage });

//la recherche a-t'elle changée entre-temps (sinon affiche les vieux résultats)
    if (token !== searchToken) {
      return;
    }

//on calcule le nombre total de pages
    totalPages = Math.ceil(Number(data.totalResults) / 10);
    nextPage++;
//on ajoute les films trouvés (et avec un poster) au tableau foundMovies
    foundMovies.push(...data.Search.filter(hasPoster));
  }
}

//on ajoute une rangée de résultats
async function showBatch() {
  const token = searchToken;
  const isFirstBatch = shownCount === 0;

//on empêche l'utilisateur de cliquer en masse
  moreButton.disabled = true;
  moreButton.textContent = "Chargement…";
  statusMessage.textContent = isFirstBatch ? "Recherche en cours…" : "";

  try {
//on charge un film d'avance pour améliorer l'expérience utilisateur
    await fillFoundMovies(shownCount + batchSize + 1, token);

//on vérifie que la recherche ne change pas
    if (token !== searchToken) {
      return;
    }

//on récupère les films non affichés et on met à jour le compteur de films affichés
    const movies = foundMovies.slice(shownCount, shownCount + batchSize);
    shownCount += movies.length;

//si des films ont été récupérés, on les affiche dans une nouvelle rangée
    if (movies.length > 0) {
      const row = await createRow(movies);

//on re-vérifie que la recherche ne change pas
      if (token !== searchToken) {
        return;
      }

      rowsContainer.append(row);

//Un scroll auto vers la nouvelle rangée (sauf la première)
      if (!isFirstBatch) {
        row.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      }
    }

//Si aucun film, on affiche un message d'erreur
    statusMessage.textContent =
      shownCount === 0 ? "Aucun film trouvé." : "";
//On affiche le bouton + seulement s'il reste des films à afficher
      moreButton.hidden = shownCount >= foundMovies.length;
    moreButton.textContent = buttonLabel;
  } catch (error) {
//on affiche l'erreur seulement si la recherche n'a pas changé entre-temps
    if (token === searchToken) {
      console.error("Failed to load movies:", error);
//on récupère les erreurs OMDB
      statusMessage.textContent = getErrorText(error);
//on affiche le bouton si aucun film n'a été trouvé
      moreButton.hidden = shownCount === 0;
      moreButton.textContent = "Réessayer";
    }
  } finally {
//on réactive le bouton seulement si la recherche n'a pas changé entre-temps
    if (token === searchToken) {
      moreButton.disabled = false;
    }
  }
}

//on lance la recherche en direct
function runSearch() {
  resetSearch();
  query = searchInput.value.trim();

  if (query) {
    showBatch();
  }
}

//Recherche API
searchInput.addEventListener("input", () => {
//on annule le timer s'il y en avait un, et on en crée un nouveau pour la recherche
  clearTimeout(searchTimer);
  searchTimer = setTimeout(runSearch, searchDelay);
});

//on lance la recherche au clic sur le bouton +
moreButton.addEventListener("click", showBatch);

initTopButton();
