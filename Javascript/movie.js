
import { fetchOmdb } from "./omdb.js";
import { initTopButton } from "./topButton.js";

// Éléments de la page
const movieDetail = document.querySelector("#movieDetail");
const movieStatus = document.querySelector("#movieStatus");

// Identifiant IMDb transmis par la carte du film
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

// Affiche disponible ?
function hasPoster(movie) {
  return movie.Poster && movie.Poster !== "N/A";
}

// Crée un élément texte sans interpréter de HTML
function createText(tag, className, value) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = value || "";
  return element;
}

// Ajoute un bloc de détails
function addDetail(parent, label, value) {
  if (!value || value === "N/A") return;

  const line = document.createElement("p");
  line.className = "movieInfoLine";

  const title = document.createElement("span");
  title.className = "movieInfoLabel";
  title.textContent = `${label} : `;

  const content = document.createElement("span");
  content.textContent = value;

  line.append(title, content);
  parent.append(line);
}

// Ajoute une section avec un titre
function addSection(parent, title, content) {
  if (!content || content === "N/A") return;

  const section = document.createElement("section");
  section.className = "movieInfoSection";

  section.append(
    createText("h2", "movieSectionTitle", title),
    createText("p", "movieSectionText", content)
  );

  parent.append(section);
}

// Génère toute la page
function renderMovie(movie) {
  document.title = `Les Amphis — ${movie.Title}`;

  const layout = document.createElement("div");
  layout.className = "movieLayout";

  // Colonne gauche : affiche
  const posterColumn = document.createElement("div");
  posterColumn.className = "moviePosterColumn";

  const poster = document.createElement("img");
  poster.className = "moviePoster";
  poster.alt = `Affiche de ${movie.Title}`;

  if (hasPoster(movie)) {
    poster.src = movie.Poster;
  } else {
    posterColumn.classList.add("noPoster");
    poster.alt = "Affiche indisponible";
  }

  posterColumn.append(poster);

  // Colonne droite : informations
  const info = document.createElement("div");
  info.className = "movieInfo";

  info.append(
    createText("p", "movieEyebrow", "LES AMPHIS"),
    createText("h1", "movieTitle", movie.Title)
  );

  // Informations principales
  const metadata = document.createElement("div");
  metadata.className = "movieMetadata";

  [movie.Year, movie.Rated, movie.Runtime, movie.Genre]
    .filter(value => value && value !== "N/A")
    .forEach(value => {
      metadata.append(
        createText("span", "movieMetadataItem", value)
      );
    });

  info.append(metadata);

  // Notes
  const ratings = document.createElement("div");
  ratings.className = "movieRatings";

  if (movie.imdbRating && movie.imdbRating !== "N/A") {
    const imdb = document.createElement("p");
    imdb.className = "movieRating";

    const star = document.createElement("span");
    star.className = "movieStar";
    star.textContent = "★";

    imdb.append(
      star,
      document.createTextNode(` ${movie.imdbRating}/10 IMDb`)
    );

    ratings.append(imdb);
  }

  if (movie.Metascore && movie.Metascore !== "N/A") {
    ratings.append(
      createText("p", "movieRating", `Metascore : ${movie.Metascore}/100`)
    );
  }

  if (ratings.children.length) {
    info.append(ratings);
  }

  // Synopsis
  addSection(info, "Synopsis", movie.Plot);

  // Réalisation et scénario
  addDetail(info, "Réalisateur", movie.Director);
  addDetail(info, "Scénario", movie.Writer);

  // Casting
  addSection(info, "Casting", movie.Actors);

  // Informations complémentaires
  const extra = document.createElement("section");
  extra.className = "movieExtra";

  addDetail(extra, "Date de sortie", movie.Released);
  addDetail(extra, "Durée", movie.Runtime);
  addDetail(extra, "Langue", movie.Language);
  addDetail(extra, "Pays", movie.Country);
  addDetail(extra, "Récompenses", movie.Awards);
  addDetail(extra, "Box-office", movie.BoxOffice);
  addDetail(extra, "Votes IMDb", movie.imdbVotes);

  if (extra.children.length) {
    info.append(
      createText("h2", "movieSectionTitle", "Informations"),
      extra
    );
  }

  layout.append(posterColumn, info);
  movieDetail.replaceChildren(layout);
  movieDetail.setAttribute("aria-busy", "false");
}

// Chargement du film
async function loadMovie() {
  if (!movieId) {
    movieStatus.textContent =
      "Aucun film sélectionné. Retournez à l'accueil pour choisir un film.";
    movieDetail.setAttribute("aria-busy", "false");
    return;
  }

  movieStatus.textContent = "Chargement du film…";

  try {
    // Utilise la fonction existante du projet
    const movie = await fetchOmdb({ i: movieId, plot: "full" });

    renderMovie(movie);
    movieStatus.textContent = "";
  } catch (error) {
    console.error("Failed to load movie:", error);

    movieStatus.textContent =
      "Impossible de charger ce film. Vérifiez votre connexion puis réessayez.";

    movieDetail.setAttribute("aria-busy", "false");
  }
}

initTopButton();
loadMovie();
