import { apiKey } from "./config.js";

// Envoyer une requête à l'API OMDb et renvoyer les données reçues
export async function fetchOmdb(params) {
  // Construire l'adresse avec la clé et les paramètres demandés
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", apiKey);
  for (const key in params) {
    url.searchParams.set(key, params[key]);
  }

  // Envoyer la requête
  const response = await fetch(url);

  // Lire la réponse (data reste vide si elle est illisible)
  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  // « Response: False » quand la demande échoue
  if (response.ok === false || data.Response === "False") {
    if (data.Error) {
      throw new Error(data.Error);
    }
    throw new Error("Erreur HTTP : " + response.status);
  }

  return data;
}
