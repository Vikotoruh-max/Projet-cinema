// Choisir un défilement doux
export function scrollBehavior() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Pas d'animation si l'utilisateur les a réduites
  if (reducedMotion.matches) {
    return "auto";
  }
  return "smooth";
}
