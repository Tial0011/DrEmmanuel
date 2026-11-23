import { config } from "./config.js";
import { loadComponents, loadSections, showLoadError } from "./component-loader.js";
import { initNavigation } from "./navigation.js";
import { initAnimations } from "./animations.js";
import { initMemoryWall } from "./memory-wall.js";
import { bindConfig, $ } from "./utils.js";

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
