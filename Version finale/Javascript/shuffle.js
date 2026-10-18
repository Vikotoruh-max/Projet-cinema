// Mélanger une liste
export function shuffle(list) {
  // Copier la liste pour garder l'originale intacte
  const copy = list.slice();

  // Échanger chaque élément avec un élément choisi au hasard
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy;
}
