const API_KEY = "cb57f734";

const filmIds = [
  "tt15239678",
  "tt1160419",
  "tt1856101",
  "tt2543164",
  "tt1392214",
  "tt3397884",
  "tt2316414"
];

const galerie = document.querySelector("#movie-gallery");

async function obtenirFilm(id) {
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", API_KEY);
  url.searchParams.set("i", id);

  const reponse = await fetch(url);

  if (!reponse.ok) {
    throw new Error(`Erreur HTTP : ${reponse.status}`);
  }

  const film = await reponse.json();

  if (film.Response === "False") {
    throw new Error(film.Error || "Film introuvable");
  }

  return film;
}

function creerCarte(film) {
  const carte = document.createElement("a");
  carte.className = "movie-card";
  carte.href = `movie.html?id=${encodeURIComponent(film.imdbID)}`;
  carte.setAttribute("aria-label", `Découvrir ${film.Title}`);

  const poster = document.createElement("img");
  poster.className = "poster";
  poster.loading = "lazy";

  const imageDisponible = film.Poster && film.Poster !== "N/A";

  if (imageDisponible) {
    poster.alt = `Affiche de ${film.Title}`;
    poster.src = film.Poster;
    carte.style.setProperty("--poster-image", `url("${film.Poster}")`);
  } else {
    poster.alt = `Affiche indisponible pour ${film.Title}`;
    poster.classList.add("poster-missing");
  }

  carte.appendChild(poster);
  return carte;
}

async function afficherFilms() {
  if (!galerie) {
    console.error("Élément #movie-gallery introuvable dans la page.");
    return;
  }

  galerie.setAttribute("aria-busy", "true");

  try {
    // allSettled : un film en erreur n'empêche pas d'afficher les autres.
    const resultats = await Promise.allSettled(filmIds.map(obtenirFilm));

    const films = resultats
      .filter(r => r.status === "fulfilled")
      .map(r => r.value);

    resultats
      .filter(r => r.status === "rejected")
      .forEach(r => console.error("Film non chargé :", r.reason));

    if (films.length === 0) {
      throw new Error("Aucun film n'a pu être chargé.");
    }

    galerie.replaceChildren(...films.map(creerCarte));
  
} catch (erreur) {
  console.error("Erreur complète :", erreur);

  galerie.textContent =
    "Impossible de charger les films. Consulte la console du navigateur.";

} finally {
  galerie.setAttribute("aria-busy", "false");
}
}

afficherFilms();