/* The only autonomous motion on the page: the hero entrance and pulse trace.
   CSS does the work; this just flips the page into its ready state once fonts and images settle. */
export function initAnimations() {
  const go = () => requestAnimationFrame(() => document.documentElement.classList.add("is-ready"));
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, new Promise((r) => setTimeout(r, 1200))]).then(go);
}
