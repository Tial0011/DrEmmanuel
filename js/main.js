import { config } from "./config.js";
import { loadComponents, loadSections, showLoadError } from "./component-loader.js";
import { initNavigation } from "./navigation.js";
import { initAnimations } from "./animations.js";
import { bindConfig, $ } from "./utils.js";

async function boot() {
  try {
    await loadSections(config.sections, $("#main-content"));
    await loadComponents();
    bindConfig();
    initNavigation();
    initAnimations();

    // Portrait fallback if the real photo is missing
    const img = $("[data-portrait]");
    if (img) img.addEventListener("error", () => { img.src = "assets/images/portrait-placeholder.svg"; }, { once: true });
  } catch (err) {
    document.documentElement.classList.add("no-js");
    showLoadError(err);
  }
}

boot();
