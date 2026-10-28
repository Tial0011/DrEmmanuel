import { config } from "./config.js";

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const resolve = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), config);

/** Fill [data-config="site.email"] text and [data-config-href="site.email"] links (with optional data-prefix). */
export function bindConfig(root = document) {
  $$("[data-config]", root).forEach((el) => {
    const v = resolve(el.dataset.config);
    if (v != null) el.textContent = v;
  });
  $$("[data-config-href]", root).forEach((el) => {
    const v = resolve(el.dataset.configHref);
    if (v != null) el.setAttribute("href", (el.dataset.prefix || "") + v);
  });
}

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
