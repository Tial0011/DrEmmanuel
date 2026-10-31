import { galleryItems } from "./gallery-data.js";
import { createLightbox } from "./lightbox.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("gallery-grid");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const countNote = document.getElementById("gallery-count-note");
  
  if (!grid) return;

  let currentCategory = "all";
  let activeList = [...galleryItems];
  const lightbox = createLightbox(activeList);

  function renderGrid() {
    grid.innerHTML = "";
    
    activeList.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "memory-card gallery-item";
      card.dataset.index = index;
      card.tabIndex = 0;
      card.role = "button";
      card.setAttribute("aria-label", `View photo: ${item.title}`);

      card.innerHTML = `
        <div class="memory-card__media">
          <img class="memory-card__img" src="${item.thumb || item.image}" alt="${item.title}" loading="lazy">
          <span class="memory-card__badge">${item.badge || item.category}</span>
          <div class="memory-card__overlay">
            <span class="memory-card__zoom-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              Enlarge Photo
            </span>
          </div>
        </div>
        <div class="memory-card__body">
          <h3 class="memory-card__title">${item.title}</h3>
          <p class="memory-card__desc">${item.description}</p>
          <div class="memory-card__footer">
            <span class="memory-card__location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${item.location || "Field Archive"}
            </span>
            <span class="memory-card__action">Expand <span aria-hidden="true">↗</span></span>
          </div>
        </div>
      `;

      const openCard = () => lightbox.open(index, activeList);
      card.addEventListener("click", openCard);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openCard();
        }
      });

      grid.appendChild(card);
    });

    if (countNote) {
      countNote.textContent = `Showing ${activeList.length} of ${galleryItems.length} moments`;
    }
  }

  function applyFilter(category) {
    currentCategory = category;
    if (category === "all") {
      activeList = [...galleryItems];
    } else {
      activeList = galleryItems.filter((item) => item.categorySlug === category);
    }
    lightbox.setItems(activeList);
    renderGrid();
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyFilter(btn.dataset.filter);
    });
  });

  // Mobile menu toggle on gallery page
  const toggle = document.querySelector(".navbar__toggle");
  const menu = document.querySelector(".mobile-menu");
  const navbar = document.querySelector(".navbar");
  if (toggle && menu && navbar) {
    const setOpen = (open) => {
      navbar.classList.toggle("is-open", open);
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  }

  // Initial render
  renderGrid();
});

