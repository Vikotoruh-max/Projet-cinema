// Affiche disponible ?
export function hasPoster(movie) {
  return movie.Poster && movie.Poster !== "N/A";
}

// Version grande de l'affiche
function toLargePoster(url) {
  return url.replace(/_SX\d+/, "_SX700");
}

// Crée une carte de film
export function createCard(movie, index) {
  const card = document.createElement("a");
  card.className = "movieCard";
  card.style.setProperty("--cardIndex", index);
  card.href = `movie.html?id=${encodeURIComponent(movie.imdbID)}`;
  card.setAttribute("aria-label", `Découvrir ${movie.Title}`);

  const largeUrl = toLargePoster(movie.Poster);

  const poster = document.createElement("img");
  poster.className = "poster";
  poster.alt = `Affiche de ${movie.Title}`;
  poster.src = largeUrl;

  // Retour à l'affiche originale
  poster.addEventListener(
    "error",
    () => {
      poster.src = movie.Poster;
    },
    { once: true },
  );

  card.style.setProperty("--posterImage", `url("${largeUrl}")`);
  card.appendChild(poster);

  return card;
}
