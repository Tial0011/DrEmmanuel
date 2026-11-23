import { config } from "./config.js";
import { loadComponents, loadSections, showLoadError } from "./component-loader.js";
import { initNavigation } from "./navigation.js";
import { initAnimations } from "./animations.js";
import { initMemoryWall } from "./memory-wall.js";
import { bindConfig, $ } from "./utils.js";

function initHeroSlideshow() {
  const slideshow = document.querySelector("[data-hero-slideshow]");
  if (!slideshow || window.matchMedia("(min-width: 761px)").matches) return;

  const slides = [...slideshow.querySelectorAll(".portrait__slide")];
  const controls = [...document.querySelectorAll(".portrait__mobile-controls button")];
  if (!slides.length || !controls.length) return;

  let activeIndex = 0;
  let intervalId;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
      slide.setAttribute("aria-hidden", slideIndex === activeIndex ? "false" : "true");
    });
    controls.forEach((control, controlIndex) => {
      const active = controlIndex === activeIndex;
      control.classList.toggle("is-active", active);
      control.setAttribute("aria-pressed", active ? "true" : "false");
    });
  };

  const stop = () => {
    if (intervalId) window.clearInterval(intervalId);
  };

  const start = () => {
    stop();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      intervalId = window.setInterval(() => showSlide(activeIndex + 1), 5200);
    }
  };

  controls.forEach((control, index) => {
    control.addEventListener("click", () => {
      showSlide(index);
      start();
    });
  });

  slideshow.addEventListener("pointerenter", stop);
  slideshow.addEventListener("pointerleave", start);
  slideshow.addEventListener("touchstart", stop, { passive: true });
  slideshow.addEventListener("touchend", start, { passive: true });

  showSlide(0);
  start();
}

function initContactForm() {
  const form = $("#collaboration-form");
  if (!form) return;

  const status = $("#form-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";

    if (!form.checkValidity()) {
      status.textContent = "Please complete the required fields.";
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    if (String(data.get("company") || "").trim()) return;

    const subject = `Website enquiry: ${data.get("type")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Organisation: ${data.get("organisation") || "Not provided"}`,
      `Enquiry type: ${data.get("type")}`,
      "",
      "Message:",
      String(data.get("message")),
    ].join("\n");

    status.textContent = "Opening your email application to send this enquiry.";
    window.location.href = `mailto:${config.site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

async function boot() {
  try {
    const main = $("#main-content");
    if (!main.children.length) await loadSections(config.sections, main);
    await loadComponents();
    bindConfig();
    initNavigation();
    initAnimations();
    initHeroSlideshow();
    initMemoryWall();
    initContactForm();

    // Portrait fallback if the real photo is missing
    const img = $("[data-portrait]");
    if (img) img.addEventListener("error", () => { img.src = "assets/images/portrait-placeholder.svg"; }, { once: true });
  } catch (err) {
    document.documentElement.classList.add("no-js");
    showLoadError(err);
  }
}

boot();
