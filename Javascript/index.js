import { fetchOmdb } from "./omdb.js";
import { hasPoster } from "./card.js";
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
const buttonLabel = moreButton.textContent.trim();
const queue = shuffle(movieIds);
let cursor = 0;

// Lot de films
async function loadBatch() {
  const batch = [];

// Prend un lot de films
  while (batch.length < batchSize && cursor < queue.length) {
    const ids = queue.slice(cursor, cursor + (batchSize - batch.length));
    cursor += ids.length;

// Appelle l’API OMDb
    const results = await Promise.allSettled(
      ids.map((id) => fetchOmdb({ i: id })),
    );

// Si tout échoue
    if (results.every((result) => result.status === "rejected")) {
      throw results[0].reason;
    }

// Si certains échouent
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Movie not loaded:", result.reason);
// Si tout fonctionne et que le film a un poster
      } else if (hasPoster(result.value)) {
        batch.push(result.value);
      }
    });
  }

// montre le résultat  
  return batch;
}

// Rangée d'affiches
async function showBatch() {
  const isFirstLoad = rowsContainer.children.length === 0;

//on empêche l'utilisateur de cliquer en masse
  moreButton.disabled = true;
  moreButton.textContent = "Chargement…";
  statusMessage.textContent = "";
//on indique que le conteneur est occupé pour l'accessibilité
  rowsContainer.setAttribute("aria-busy", "true");

//on essaie de récupérer des films
  try {
    const movies = await loadBatch();

//si des films ont été récupérés, on les affiche dans une nouvelle rangée
    if (movies.length > 0) {
      const row = await createRow(movies);
      rowsContainer.append(row);

//si ce n'est pas le premier lot, on fait défiler jusqu'à la nouvelle rangée
      if (!isFirstLoad) {
        row.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      }
    }

//si tous les films ont été affichés, on cache le bouton "plus" et on affiche un message
    if (cursor >= queue.length) {
      moreButton.hidden = true;
      statusMessage.textContent = "Tous les films ont été affichés.";
    } else {
      moreButton.hidden = false;
      moreButton.textContent = buttonLabel;
    }
//si une erreur se produit lors du chargement des films, on affiche un message et le bouton "réessayer"
  } catch (error) {
    console.error("Failed to load movies:", error);
    statusMessage.textContent = `Impossible de charger les films (${error.message}).`;
    moreButton.hidden = false;
    moreButton.textContent = "Réessayer";
//on réactive le bouton et met fin à l'état "aria-busy" pour l'accessibilité
  } finally {
    moreButton.disabled = false;
    rowsContainer.setAttribute("aria-busy", "false");
  }
}

moreButton.addEventListener("click", showBatch);

initTopButton();
showBatch();
