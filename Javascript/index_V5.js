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

// Libellé initial du bouton
const buttonLabel = moreButton.textContent.trim();

// Liste mélangée et position
const queue = shuffle(movieIds);
let cursor = 0;

// Charge un lot de films
async function loadBatch() {
  const batch = [];

  while (batch.length < batchSize && cursor < queue.length) {
    const ids = queue.slice(cursor, cursor + (batchSize - batch.length));
    cursor += ids.length;

    const results = await Promise.allSettled(
      ids.map((id) => fetchOmdb({ i: id })),
    );

    // Tout échoué : on arrête
    if (results.every((result) => result.status === "rejected")) {
      throw results[0].reason;
    }

    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Movie not loaded:", result.reason);
      } else if (hasPoster(result.value)) {
        batch.push(result.value);
      }
    });
  }

  return batch;
}

// Ajoute une rangée d'affiches
async function showBatch() {
  const isFirstLoad = rowsContainer.children.length === 0;

  moreButton.disabled = true;
  moreButton.textContent = "Chargement…";
  statusMessage.textContent = "";
  rowsContainer.setAttribute("aria-busy", "true");

  try {
    const movies = await loadBatch();

    if (movies.length > 0) {
      const row = await createRow(movies);
      rowsContainer.append(row);

      if (!isFirstLoad) {
        row.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      }
    }

    if (cursor >= queue.length) {
      moreButton.hidden = true;
      statusMessage.textContent = "Toutes les affiches de la liste ont été affichées.";
    } else {
      moreButton.hidden = false;
      moreButton.textContent = buttonLabel;
    }
  } catch (error) {
    console.error("Failed to load movies:", error);
    statusMessage.textContent = `Impossible de charger les films (${error.message}).`;
    moreButton.hidden = false;
    moreButton.textContent = "Réessayer";
  } finally {
    moreButton.disabled = false;
    rowsContainer.setAttribute("aria-busy", "false");
  }
}

moreButton.addEventListener("click", showBatch);

initTopButton();
showBatch();
