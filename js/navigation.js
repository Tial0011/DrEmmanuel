import { config } from "./config.js";
import { $, $$ } from "./utils.js";

export function initNavigation() {
  const navbar = $(".navbar");
  if (!navbar) return;

  // Render links from config
  const linkHTML = (cls) => config.nav.map((n, index) => `<a class="${cls}" href="#${n.id}" data-target="${n.id}" data-index="${String(index + 1).padStart(2, "0")}">${n.label}</a>`).join("");
  $("[data-nav-links]").innerHTML = linkHTML("navbar__link");
  $("[data-mobile-links]").insertAdjacentHTML("afterbegin", linkHTML("mobile-menu__link"));
  const desktopLinks = $("[data-nav-links]");
  desktopLinks.insertAdjacentHTML("beforeend", '<span class="navbar__indicator" aria-hidden="true"></span>');
  $$("[data-cta]").forEach((el) => {
    el.textContent = config.navCta.label;
    el.setAttribute("href", `#${config.navCta.target}`);
  });

  // Scrolled state
  const onScroll = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 24);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
    document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const toggle = $(".navbar__toggle");
  const menu = $(".mobile-menu");
  const setOpen = (open) => {
    navbar.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  window.matchMedia("(min-width: 960px)").addEventListener("change", (e) => e.matches && setOpen(false));

  // Scroll-spy
  const links = $$("[data-target]");
  const indicator = $(".navbar__indicator");
  const setActive = (target) => {
    links.forEach((a) => a.classList.toggle("is-active", a.dataset.target === target));
    const activeDesktopLink = desktopLinks.querySelector(`[data-target="${target}"]`);
    if (!indicator) return;
    if (!activeDesktopLink) {
      indicator.classList.remove("is-visible");
      return;
    }
    indicator.style.width = `${activeDesktopLink.offsetWidth}px`;
    indicator.style.transform = `translateX(${activeDesktopLink.offsetLeft}px)`;
    indicator.classList.add("is-visible");
  };
  const sections = config.nav.map((n) => document.getElementById(n.id)).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
  // Clear highlight while on the hero
  const hero = document.getElementById("home");
  if (hero) new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), { rootMargin: "-45% 0px -50% 0px" }).observe(hero);
  window.addEventListener("resize", () => {
    const active = desktopLinks.querySelector(".navbar__link.is-active");
    if (active) setActive(active.dataset.target);
  }, { passive: true });
}
