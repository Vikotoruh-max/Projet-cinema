import { createCard } from "./card.js";

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
export async function createRow(movies) {
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
