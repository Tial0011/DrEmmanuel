/**
 * Accessible, lightweight, dependency-free Lightbox Modal
 */
export function createLightbox(items = []) {
  let currentIndex = 0;
  let activeItems = [...items];
  let previousActiveElement = null;

  // Create modal container if not already in document
  let modal = document.getElementById("lightbox-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "lightbox-modal";
    modal.className = "lightbox-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("tabindex", "-1");
    modal.innerHTML = `
      <div class="lightbox-backdrop" data-action="close"></div>
      <div class="lightbox-dialog" role="document">
        <button class="lightbox-btn lightbox-close" type="button" data-action="close" aria-label="Close image viewer">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <button class="lightbox-btn lightbox-prev" type="button" data-action="prev" aria-label="Previous image">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="lightbox-content">
          <figure class="lightbox-figure">
            <div class="lightbox-image-wrap">
              <img class="lightbox-img" src="" alt="" />
              <div class="lightbox-spinner" aria-hidden="true"></div>
            </div>
            <figcaption class="lightbox-caption">
              <div class="lightbox-meta">
                <span class="lightbox-badge"></span>
                <span class="lightbox-location"></span>
                <span class="lightbox-counter"></span>
              </div>
              <h3 class="lightbox-title"></h3>
              <p class="lightbox-desc"></p>
            </figcaption>
          </figure>
        </div>
        <button class="lightbox-btn lightbox-next" type="button" data-action="next" aria-label="Next image">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;
      const action = target.dataset.action;
      if (action === "close") close();
      else if (action === "prev") prev();
      else if (action === "next") next();
    });

    document.addEventListener("keydown", (e) => {
      if (modal.getAttribute("aria-hidden") === "true") return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    });
  }

  const imgEl = modal.querySelector(".lightbox-img");
  const spinnerEl = modal.querySelector(".lightbox-spinner");
  const badgeEl = modal.querySelector(".lightbox-badge");
  const locEl = modal.querySelector(".lightbox-location");
  const titleEl = modal.querySelector(".lightbox-title");
  const descEl = modal.querySelector(".lightbox-desc");
  const counterEl = modal.querySelector(".lightbox-counter");

  function render(index) {
    if (!activeItems.length) return;
    currentIndex = (index + activeItems.length) % activeItems.length;
    const item = activeItems[currentIndex];

    spinnerEl.style.display = "block";
    imgEl.style.opacity = "0";

    const preloader = new Image();
    preloader.src = item.image;
    preloader.onload = () => {
      imgEl.src = item.image;
      imgEl.alt = item.title;
      imgEl.style.opacity = "1";
      spinnerEl.style.display = "none";
    };
    preloader.onerror = () => {
      imgEl.src = item.image;
      imgEl.alt = item.title;
      imgEl.style.opacity = "1";
      spinnerEl.style.display = "none";
    };

    badgeEl.textContent = item.badge || item.category || "Moment";
    locEl.textContent = item.location ? `· ${item.location}` : "";
    titleEl.textContent = item.title;
    descEl.textContent = item.description || "";
    counterEl.textContent = `${currentIndex + 1} / ${activeItems.length}`;
  }

  function open(index = 0, currentList = null) {
    if (currentList && currentList.length) {
      activeItems = [...currentList];
    } else {
      activeItems = [...items];
    }
    previousActiveElement = document.activeElement;
    render(index);
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.focus();
  }

  function close() {
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (previousActiveElement && typeof previousActiveElement.focus === "function") {
      previousActiveElement.focus();
    }
  }

  function prev() {
    render(currentIndex - 1);
  }

  function next() {
    render(currentIndex + 1);
  }

  function setItems(newItems) {
    activeItems = [...newItems];
  }

  return { open, close, prev, next, setItems, render };
}

