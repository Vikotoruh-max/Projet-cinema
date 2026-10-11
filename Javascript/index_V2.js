const API_KEY = "cb57f734";
const TAILLE_LOT = 7;

/*    LISTE DES FILMS */
const FILMS = [
  "tt15239678",
  "tt1160419",
  "tt1856101",
  "tt2543164",
  "tt1392214",
  "tt3397884",
  "tt2316414",
  "tt0111161",
  "tt0068646",
  "tt0071562",
  "tt0468569",
  "tt0050083",
  "tt0108052",
  "tt0167260",
  "tt0110912",
  "tt0060196",
  "tt0137523",
  "tt0109830",
  "tt1375666",
  "tt0167261",
  "tt0080684",
  "tt0133093",
  "tt0099685",
  "tt0073486",
  "tt0114369",
  "tt0038650",
  "tt0047478",
  "tt0102926",
  "tt0120815",
  "tt0317248",
  "tt0118799",
  "tt0120689",
  "tt0076759",
  "tt0103064",
  "tt0088763",
  "tt0245429",
  "tt0120737",
  "tt0816692",
  "tt0253474",
  "tt0054215",
  "tt0021749",
  "tt0407887",
  "tt0172495",
  "tt0482571",
  "tt0110413",
  "tt0095765",
  "tt0078748",
  "tt0209144",
  "tt0078788",
  "tt0082971",
  "tt0405094",
  "tt0043014",
  "tt0034583",
  "tt0064116",
  "tt0057012",
  "tt0027977",
  "tt0095327",
  "tt0910970",
  "tt0114709",
  "tt0087843",
  "tt0169547",
  "tt0364569",
  "tt0119217",
  "tt0105236",
  "tt0180093",
  "tt0090605",
  "tt0211915",
  "tt0075314",
  "tt0081505",
  "tt0066921",
  "tt0062622",
  "tt0086190",
  "tt0112573",
  "tt0361748",
  "tt1853728",
  "tt0993846",
  "tt2582802",
  "tt0119698",
  "tt0347149",
  "tt0338013",
  "tt0114814",
  "tt0047396",
  "tt0053125",
  "tt0052357",
  "tt0051201",
  "tt0032138",
  "tt0033467",
  "tt0036775",
  "tt0045152",
  "tt0056172",
  "tt0053604",
  "tt0047296",
  "tt0017136",
  "tt0022100",
  "tt0245712",
  "tt0266543",
  "tt0435761",
  "tt0266697",
  "tt0208092",
  "tt0120586",
  "tt0071315",
  "tt0073195",
  "tt0083658",
  "tt0087544",
  "tt0093058",
  "tt0086250",
  "tt1130884",
  "tt0112641",
  "tt0129167",
  "tt0040522",
  "tt0050825",
  "tt0056592",
  "tt0079944",
  "tt0079470",
  "tt0120382",
  "tt0114746",
  "tt0105695",
  "tt0268978",
  "tt0758758",
  "tt0372784",
  "tt0848228",
  "tt2380307",
  "tt2096673",
  "tt0198781",
  "tt0317705",
  "tt0382932",
  "tt1049413",
  "tt0119488",
  "tt0097576",
  "tt0095016",
  "tt0094226",
  "tt0089881",
  "tt0050212",
  "tt0075148",
  "tt0071853",
  "tt0058946",
  "tt0059742",
  "tt0055031",
  "tt0112471",
  "tt0118715",
  "tt0112384",
  "tt0120338",
  "tt0126029",
  "tt0099348",
  "tt0042876",
  "tt0046438",
  "tt0053198",
  "tt0056801",
  "tt0070735",
  "tt0065214",
  "tt0042192",
  "tt0050976",
  "tt0055630",
  "tt0041959",
  "tt0032553",
  "tt0025316",
  "tt0031381",
  "tt0029583",
  "tt0053291",
  "tt0052618",
  "tt0059113",
  "tt0074958",
  "tt0077416",
  "tt0072684",
  "tt0061722",
  "tt0064115",
  "tt0082096",
  "tt0080678",
  "tt0081398",
  "tt0083987",
  "tt0086879",
  "tt0083866",
  "tt0084787",
  "tt0091763",
  "tt0093779",
  "tt0113277",
  "tt0107048",
  "tt0110357",
  "tt0101414",
  "tt0103639",
  "tt0119174",
  "tt0116282",
  "tt0167404",
  "tt0117951",
  "tt0120735",
  "tt0166924",
  "tt0246578",
  "tt0118694",
  "tt0434409",
  "tt0457430",
  "tt0469494",
  "tt0477348",
  "tt0443706",
  "tt0405159",
  "tt1010048",
  "tt1205489",
  "tt0887912",
  "tt1345836",
  "tt1895587",
  "tt2024544",
  "tt2084970",
  "tt2562232",
  "tt3659388",
  "tt3783958",
  "tt4975722",
  "tt5027774",
  "tt5013056",
  "tt1285016",
  "tt0780504",
  "tt1675434",
  "tt2267998",
  "tt1392190",
  "tt1187043",
  "tt5311514",
  "tt6751668",
  "tt7286456",
  "tt2278388",
  "tt0298148",
  "tt0120794",
  "tt0138749",
  "tt0166813",
  "tt0307453",
  "tt0351283",
  "tt0327084",
  "tt0441773",
  "tt0892782",
  "tt0892769",
  "tt1001526",
  "tt0448694",
  "tt1446192",
  "tt0481499",
  "tt0864835",
  "tt1911658",
  "tt3874544",
  "tt2091256",
  "tt6324278",
  "tt8115900",
  "tt29623480",
  "tt0327597",
  "tt1623288",
  "tt0787474",
  "tt4302938",
  "tt6348138",
  "tt4633694",
  "tt7979580",
  "tt6338498",
  "tt9362722",
  "tt0837562",
  "tt0844471",
  "tt1430626",
  "tt0312004",
  "tt0120630",
  "tt2872750",
  "tt0432283",
  "tt5104604",
  "tt0107688",
  "tt0121164",
  "tt1488589",
  "tt0119282",
  "tt0120762",
  "tt0275847",
  "tt0120917",
  "tt0780521",
  "tt1192628",
  "tt5698568",
  "tt0241527",
  "tt0325980",
  "tt0365748",
  "tt0499549",
  "tt1663202",
  "tt5052448",
  "tt6710474",
  "tt1745960",
  "tt1877830",
  "tt0088247",
  "tt0093773",
  "tt0093870",
  "tt0096438",
  "tt0097165",
  "tt0099785",
  "tt0102685",
  "tt0107290",
  "tt0119116",
  "tt0133093",
  "tt0129167",
  "tt0120586",
  "tt0120689",
  "tt0118715",
];

const rangees = document.querySelector("#movie-rows");
const bouton = document.querySelector("#more-button");
const statut = document.querySelector("#status");

const LIBELLE_BOUTON = `Afficher ${TAILLE_LOT} autres films`;

/* Mélange de la liste (Fisher-Yates) : chaque visite montre un ordre différent,
   et un film n'apparaît jamais deux fois. */
function melanger(liste) {
  const copie = [...new Set(liste)];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

const file = melanger(FILMS);
let curseur = 0;

async function obtenirFilm(id) {
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", API_KEY);
  url.searchParams.set("i", id);

  const reponse = await fetch(url);
  const film = await reponse.json().catch(() => ({}));

  if (!reponse.ok || film.Response === "False") {
    throw new Error(film.Error || `Erreur HTTP : ${reponse.status}`);
  }

  return film;
}

function afficheDisponible(film) {
  return film.Poster && film.Poster !== "N/A";
}

/* OMDb renvoie des affiches de 300 px de large : floues sur de grandes cartes.
   On demande une version plus grande ; si elle n'existe pas, on revient à l'originale. */
function afficheHD(url) {
  return url.replace(/_SX\d+/, "_SX700");
}

function creerCarte(film) {
  const carte = document.createElement("a");
  carte.className = "movie-card";
  carte.href = `movie.html?id=${encodeURIComponent(film.imdbID)}`;
  carte.setAttribute("aria-label", `Découvrir ${film.Title}`);

  const urlHD = afficheHD(film.Poster);

  const poster = document.createElement("img");
  poster.className = "poster";
  poster.alt = `Affiche de ${film.Title}`;
  poster.loading = "lazy";
  poster.src = urlHD;
  poster.addEventListener(
    "error",
    () => {
      poster.src = film.Poster;
    },
    { once: true },
  );

  carte.style.setProperty("--poster-image", `url("${urlHD}")`);
  carte.appendChild(poster);

  return carte;
}

/* Récupère TAILLE_LOT films avec affiche.
   Si un film est introuvable ou n'a pas d'affiche, on en pioche un autre. */
async function chargerLot() {
  const lot = [];

  while (lot.length < TAILLE_LOT && curseur < file.length) {
    const ids = file.slice(curseur, curseur + (TAILLE_LOT - lot.length));
    curseur += ids.length;

    const resultats = await Promise.allSettled(ids.map(obtenirFilm));

    // Tout a échoué (clé refusée, limite atteinte, pas de réseau) : inutile d'insister.
    if (resultats.every((r) => r.status === "rejected")) {
      throw resultats[0].reason;
    }

    resultats.forEach((r) => {
      if (r.status === "rejected") {
        console.error("Film non chargé :", r.reason);
      } else if (afficheDisponible(r.value)) {
        lot.push(r.value);
      }
    });
  }

  return lot;
}

async function afficherLot() {
  const premierChargement = rangees.children.length === 0;

  bouton.disabled = true;
  bouton.textContent = "Chargement…";
  statut.textContent = "";
  rangees.setAttribute("aria-busy", "true");

  try {
    const films = await chargerLot();

    if (films.length > 0) {
      const rangee = document.createElement("div");
      rangee.className = "movie-gallery";
      rangee.append(...films.map(creerCarte));
      rangees.append(rangee);

      if (!premierChargement) {
        const reduit = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        rangee.scrollIntoView({
          behavior: reduit ? "auto" : "smooth",
          block: "center",
        });
      }
    }

    if (curseur >= file.length) {
      bouton.hidden = true;
      statut.textContent = "Toutes les affiches de la liste ont été affichées.";
    } else {
      bouton.hidden = false;
      bouton.textContent = LIBELLE_BOUTON;
    }
  } catch (erreur) {
    console.error("Impossible de charger les films :", erreur);
    statut.textContent = `Impossible de charger les films (${erreur.message}).`;
    bouton.hidden = false;
    bouton.textContent = "Réessayer";
  } finally {
    bouton.disabled = false;
    rangees.setAttribute("aria-busy", "false");
  }
}

bouton.addEventListener("click", afficherLot);
afficherLot();

/* Bouton « Revenir en haut » : visible dès qu'on a défilé de plus de 80 % d'un écran. */
const boutonHaut = document.querySelector("#top-button");

function majBoutonHaut() {
  boutonHaut.hidden = window.scrollY < window.innerHeight * 0.8;
}

window.addEventListener("scroll", majBoutonHaut, { passive: true });

boutonHaut.addEventListener("click", () => {
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduit ? "auto" : "smooth" });
});

majBoutonHaut();
