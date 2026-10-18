import { scrollBehavior } from "./scroll.js";

// Bouton retour en haut
export function initTopButton() {
  const topButton = document.querySelector(".topButton");

  // Visible après un défilement
  function updateTopButton() {
    topButton.hidden = window.scrollY < window.innerHeight * 0.8;
  }

  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  });

  window.addEventListener("scroll", updateTopButton, { passive: true });

  updateTopButton();
}
