import { scrollBehavior } from "./scroll.js";

// Bouton "Revenir en haut"
export function initTopButton() {
  const topButton = document.querySelector(".topButton");

  // Afficher le bouton quand on a descendu la page
  function updateTopButton() {
    if (window.scrollY < window.innerHeight * 0.7) {
      topButton.hidden = true;
    } else {
      topButton.hidden = false;
    }
  }

  // Remonter en haut de la page
  topButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  });

  // Mettre à jour la visibilité quand on défile
  window.addEventListener("scroll", updateTopButton);

  // Vérifier l'état dès l'ouverture de la page
  updateTopButton();
}
