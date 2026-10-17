// Clé de stockage
const storageKey = "selectedPoster";

// Mémorise l'affiche cliquée
export function rememberPoster(movieId, poster) {
  // Un seul élément porte le nom
  document.querySelectorAll(".poster").forEach((item) => {
    item.style.viewTransitionName = "";
  });
  poster.style.viewTransitionName = "moviePoster";

  sessionStorage.setItem(
    storageKey,
    JSON.stringify({ id: movieId, src: poster.currentSrc }),
  );
}

// Retrouve l'affiche mémorisée
export function recallPoster(movieId) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    return saved && saved.id === movieId ? saved.src : null;
  } catch {
    return null;
  }
}
