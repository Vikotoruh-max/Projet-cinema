// Mémoriser l'affiche cliquée pour la page du film
export function rememberPoster(movieId, poster) {
  // Retirer le nom de transition des autres affiches
  const allPosters = document.querySelectorAll(".poster");
  for (let i = 0; i < allPosters.length; i++) {
    allPosters[i].style.viewTransitionName = "";
  }

  // Nommer l'affiche cliquée
  poster.style.viewTransitionName = "moviePoster";

  // Garder l'identifiant du film et l'adresse de l'image pour la page suivante
  sessionStorage.setItem("posterId", movieId);
  sessionStorage.setItem("posterSrc", poster.currentSrc);
}

// Retrouver l'adresse de l'affiche mémorisée pour ce film
export function recallPoster(movieId) {
  // Utiliser l'affiche seulement si elle correspond au film demandé
  if (sessionStorage.getItem("posterId") === movieId) {
    return sessionStorage.getItem("posterSrc");
  }
  return null;
}
