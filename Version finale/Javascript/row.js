import { createCard } from "./card.js";

// Créer une rangée contenant une carte par film
export function createRow(movies) {
  const row = document.createElement("div");
  row.className = "movieGallery";

  // Ajouter chaque carte (le numéro décale l'apparition en fondu)
  for (let i = 0; i < movies.length; i++) {
    const card = createCard(movies[i], i);
    row.appendChild(card);
  }

  return row;
}
