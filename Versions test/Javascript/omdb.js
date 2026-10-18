import { apiKey } from "./config.js";

// Recherche
export async function fetchOmdb(params) {
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", apiKey);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.Response === "False") {
    throw new Error(data.Error || `Erreur HTTP : ${response.status}`);
  }

  return data;
}
