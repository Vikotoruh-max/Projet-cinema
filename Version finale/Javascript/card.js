import { fetchOmdb } from "./omdb.js";
import { rememberPoster } from "./transition.js";

// Délai affichage du résumé au survol
const synopsisDelay = 1000;

// Vérifier qu'un film possède une affiche et un identifiant
export function hasPoster(movie) {
  if (movie.Poster && movie.Poster !== "N/A" && movie.imdbID) {
    return true;
  }
  return false;
}

// Prendre la version la plus grande de l'affiche
export function toLargePoster(url) {
  return url.replace("_SX300", "_SX700");
}

// Tester si une image se charge
function canLoad(url) {
  return new Promise(function (resolve) {
    const image = new Image();

    // Image chargée ou erreur
    image.onload = function () {
      resolve(image.naturalWidth > 0);
    };
    image.onerror = function () {
      resolve(false);
    };

    // Si rien ne se charge
    setTimeout(function () {
      resolve(false);
    }, 4000);

    // Lancer le chargement
    image.src = url;
  });
}

// Vérifier qu'un film a une affiche qui se charge
async function hasLoadablePoster(movie) {
  if (hasPoster(movie) === false) {
    return false;
  }

  // Essayer la grande version du poster
  const largeWorks = await canLoad(toLargePoster(movie.Poster));
  if (largeWorks) {
    return true;
  }

  // Sinon essayer la petite version
  const smallWorks = await canLoad(movie.Poster);
  return smallWorks;
}

// Garder uniquement les films dont l'affiche se charge
export async function keepLoadablePosters(movies) {
  // Lancer tous les tests en même temps
  const tests = [];
  for (let i = 0; i < movies.length; i++) {
    tests.push(hasLoadablePoster(movies[i]));
  }
  const results = await Promise.all(tests);

  // Conserver les films dont le test a réussi
  const goodMovies = [];
  for (let i = 0; i < movies.length; i++) {
    if (results[i]) {
      goodMovies.push(movies[i]);
    }
  }
  return goodMovies;
}

// Créer la carte d'un film
export function createCard(movie, index) {
  // Lien vers la fiche du film ; l'index décale l'animation d'apparition
  const card = document.createElement("a");
  card.className = "movieCard";
  card.style.setProperty("--fadeIndex", index);
  card.href = "movie.html?id=" + encodeURIComponent(movie.imdbID);
  card.setAttribute("aria-label", "Découvrir " + movie.Title);

  // Afficher en grand format
  const largeUrl = toLargePoster(movie.Poster);
  const poster = document.createElement("img");
  poster.className = "poster";
  poster.alt = "Affiche de " + movie.Title;
  poster.loading = "lazy";
  poster.src = largeUrl;

  // Si la grande version échoue, revenir une seule fois à l'affiche originale
  let usedOriginal = false;
  poster.addEventListener("error", function () {
    if (usedOriginal === false) {
      usedOriginal = true;
      poster.src = movie.Poster;
    }
  });

  // Reflet sous les affiches
  card.style.setProperty("--posterImage", 'url("' + largeUrl + '")');

  // Titre du film
  const title = document.createElement("span");
  title.className = "movieCardTitle";
  title.textContent = movie.Title;

  // Résumé du film
  const synopsis = document.createElement("div");
  synopsis.className = "movieSynopsis";
  synopsis.textContent = "Chargement du résumé…";

  card.appendChild(poster);
  card.appendChild(title);
  card.appendChild(synopsis);

  // Préparer la transition de page
  card.addEventListener("click", function () {
    rememberPoster(movie.imdbID, poster);
  });

  // Minuteur du survol et mémoire de la demande de résumé
  let hoverTimer;
  let synopsisRequested = false;

  // Charger le résumé (une seule fois)
  async function loadSynopsis() {
    if (synopsisRequested === true) {
      return;
    }
    synopsisRequested = true;

    try {
      // Résumé déjà reçu si on est sur la page Accueil, sinon le demander
      let details = movie;
      if (!movie.Plot) {
        details = await fetchOmdb({ i: movie.imdbID, plot: "short" });
      }

      // Afficher le résumé, ou un message s'il n'existe pas
      if (details.Plot && details.Plot !== "N/A") {
        synopsis.textContent = details.Plot;
      } else {
        synopsis.textContent = "Résumé indisponible.";
      }
    } catch (error) {
      console.error("Synopsis unavailable for " + movie.Title + ":", error);
      synopsis.textContent = "Résumé indisponible.";
    }
  }

  // Charger le résumé puis l'afficher après le délai
  function startHover() {
    loadSynopsis();
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(function () {
      card.classList.add("showSynopsis");
    }, synopsisDelay);
  }

  // Enlever le résumé lorsqu'on quitte l'affiche
  function endHover() {
    clearTimeout(hoverTimer);
    card.classList.remove("showSynopsis");
  }

  // Survol de la souris
  card.addEventListener("mouseenter", startHover);
  card.addEventListener("mouseleave", endHover);

  return card;
}
