import { galleryItems } from "./gallery-data.js";
import { createLightbox } from "./lightbox.js";

export function initMemoryWall() {
  const wall = document.getElementById("memory-wall-grid");
  if (!wall) return;

  const featuredItems = galleryItems.slice(0, 6);
  const lightbox = createLightbox(featuredItems);

  const cards = wall.querySelectorAll(".memory-card");
  cards.forEach((card) => {
    const triggerIndex = Number(card.dataset.galleryIndex) || 0;
    const openCard = () => lightbox.open(triggerIndex, featuredItems);

    card.addEventListener("click", openCard);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCard();
      }
    });
  });
}

