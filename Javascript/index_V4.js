const movieIds = [
  "tt15239678", "tt1160419", "tt1856101", "tt2543164", "tt1392214", "tt3397884", "tt2316414",
  "tt0111161", "tt0068646", "tt0071562", "tt0468569", "tt0050083", "tt0108052", "tt0167260",
  "tt0110912", "tt0060196", "tt0137523", "tt0109830", "tt1375666", "tt0167261", "tt0080684",
  "tt0133093", "tt0099685", "tt0073486", "tt0114369", "tt0038650", "tt0047478", "tt0102926",
  "tt0120815", "tt0317248", "tt0118799", "tt0120689", "tt0076759", "tt0103064", "tt0088763",
  "tt0245429", "tt0120737", "tt0816692", "tt0253474", "tt0054215", "tt0021749", "tt0407887",
  "tt0172495", "tt0482571", "tt0110413", "tt0095765", "tt0078748", "tt0209144", "tt0078788",
  "tt0082971", "tt0405094", "tt0043014", "tt0034583", "tt0064116", "tt0057012", "tt0027977",
  "tt0095327", "tt0910970", "tt0114709", "tt0087843", "tt0169547", "tt0364569", "tt0119217",
  "tt0105236", "tt0180093", "tt0090605", "tt0211915", "tt0075314", "tt0081505", "tt0066921",
  "tt0062622", "tt0086190", "tt0112573", "tt0361748", "tt1853728", "tt0993846", "tt2582802",
  "tt0119698", "tt0347149", "tt0338013", "tt0114814", "tt0047396", "tt0053125", "tt0052357",
  "tt0051201", "tt0032138", "tt0033467", "tt0036775", "tt0045152", "tt0056172", "tt0053604",
  "tt0047296", "tt0017136", "tt0022100", "tt0245712", "tt0266543", "tt0435761", "tt0266697",
  "tt0208092", "tt0120586", "tt0071315", "tt0073195", "tt0083658", "tt0087544", "tt0093058",
  "tt0086250", "tt1130884", "tt0112641", "tt0129167", "tt0040522", "tt0050825", "tt0056592",
  "tt0079944", "tt0079470", "tt0120382", "tt0114746", "tt0105695", "tt0268978", "tt0758758",
  "tt0372784", "tt0848228", "tt2380307", "tt2096673", "tt0198781", "tt0317705", "tt0382932",
  "tt1049413", "tt0119488", "tt0097576", "tt0095016", "tt0094226", "tt0089881", "tt0050212",
  "tt0075148", "tt0071853", "tt0058946", "tt0059742", "tt0055031", "tt0112471", "tt0118715",
  "tt0112384", "tt0120338", "tt0126029", "tt0099348", "tt0042876", "tt0046438", "tt0053198",
  "tt0056801", "tt0070735", "tt0065214", "tt0042192", "tt0050976", "tt0055630", "tt0041959",
  "tt0032553", "tt0025316", "tt0031381", "tt0029583", "tt0053291", "tt0052618", "tt0059113",
  "tt0074958", "tt0077416", "tt0072684", "tt0061722", "tt0064115", "tt0082096", "tt0080678",
  "tt0081398", "tt0083987", "tt0086879", "tt0083866", "tt0084787", "tt0091763", "tt0093779",
  "tt0113277", "tt0107048", "tt0110357", "tt0101414", "tt0103639", "tt0119174", "tt0116282",
  "tt0167404", "tt0117951", "tt0120735", "tt0166924", "tt0246578", "tt0118694", "tt0434409",
  "tt0457430", "tt0469494", "tt0477348", "tt0443706", "tt0405159", "tt1010048", "tt1205489",
  "tt0887912", "tt1345836", "tt1895587", "tt2024544", "tt2084970", "tt2562232", "tt3659388",
  "tt3783958", "tt4975722", "tt5027774", "tt5013056", "tt1285016", "tt0780504", "tt1675434",
  "tt2267998", "tt1392190", "tt1187043", "tt5311514", "tt6751668", "tt7286456", "tt2278388",
  "tt0298148", "tt0120794", "tt0138749", "tt0166813", "tt0307453", "tt0351283", "tt0327084",
  "tt0441773", "tt0892782", "tt0892769", "tt1001526", "tt0448694", "tt1446192", "tt0481499",
  "tt0864835", "tt1911658", "tt3874544", "tt2091256", "tt6324278", "tt8115900", "tt29623480",
  "tt0327597", "tt1623288", "tt0787474", "tt4302938", "tt6348138", "tt4633694", "tt7979580",
  "tt6338498", "tt9362722", "tt0837562", "tt0844471", "tt1430626", "tt0312004", "tt0120630",
  "tt2872750", "tt0432283", "tt5104604", "tt0107688", "tt0121164", "tt1488589", "tt0119282",
  "tt0120762", "tt0275847", "tt0120917", "tt0780521", "tt1192628", "tt5698568", "tt0241527",
  "tt0325980", "tt0365748", "tt0499549", "tt1663202", "tt5052448", "tt6710474", "tt1745960",
  "tt1877830", "tt0088247", "tt0093773", "tt0093870", "tt0096438", "tt0097165", "tt0099785",
  "tt0102685", "tt0107290", "tt0119116",
];

// Éléments de la page
const rowsContainer = document.querySelector(".movieRows");
const moreButton = document.querySelector(".moreButton");
const statusMessage = document.querySelector(".statusMessage");

const buttonLabel = moreButton.textContent.trim();

// Mélange sans doublons
function shuffle(list) {
  const copy = [...new Set(list)];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Liste mélangée et position
const queue = shuffle(movieIds);
let cursor = 0;

// Charge un lot de films
async function loadBatch() {
  const batch = [];

  while (batch.length < batchSize && cursor < queue.length) {
    const ids = queue.slice(cursor, cursor + (batchSize - batch.length));
    cursor += ids.length;

    const results = await Promise.allSettled(
      ids.map((id) => fetchOmdb({ i: id })),
    );

    // Tout échoué : on arrête
    if (results.every((result) => result.status === "rejected")) {
      throw results[0].reason;
    }

    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Movie not loaded:", result.reason);
      } else if (hasPoster(result.value)) {
        batch.push(result.value);
      }
    });
  }

  return batch;
}

// Ajoute une rangée d'affiches
async function showBatch() {
  const isFirstLoad = rowsContainer.children.length === 0;

  moreButton.disabled = true;
  moreButton.textContent = "Chargement…";
  statusMessage.textContent = "";
  rowsContainer.setAttribute("aria-busy", "true");

  try {
    const movies = await loadBatch();

    if (movies.length > 0) {
      const row = await createRow(movies);
      rowsContainer.append(row);
      if (!isFirstLoad) {
        row.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      }
    }

    if (cursor >= queue.length) {
      moreButton.hidden = true;
      statusMessage.textContent = "Toutes les affiches de la liste ont été affichées.";
    } else {
      moreButton.hidden = false;
      moreButton.textContent = buttonLabel;
    }
  } catch (error) {
    console.error("Failed to load movies:", error);
    statusMessage.textContent = `Impossible de charger les films (${error.message}).`;
    moreButton.hidden = false;
    moreButton.textContent = "Réessayer";
  } finally {
    moreButton.disabled = false;
    rowsContainer.setAttribute("aria-busy", "false");
  }
}

moreButton.addEventListener("click", showBatch);

showBatch();
