/* Motion is intentionally restrained: the page reveals its story as visitors
   scroll, while CSS handles the actual transitions. */
export function initAnimations() {
  const revealTargets = [
    ".manifesto-grid > *",
    ".section-heading",
    ".platform-card",
    ".programme-strip",
    ".research-title, .research-map, .research-proof",
    ".speaking-grid article",
    ".speaker-cta",
    ".insights-intro, .insights-list",
    ".quote-section > *",
    ".contact-section > *",
    ".footer > *"
  ].flatMap((selector) => [...document.querySelectorAll(selector)]);

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 85}ms`);
  });

  const reveal = () => {
    document.documentElement.classList.add("is-ready");
    const portrait = document.querySelector(".portrait");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
      portrait?.classList.add("is-frame-ready");
      return;
    }
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
    revealTargets.forEach((element) => observer.observe(element));

    if (portrait) {
      const portraitObserver = new IntersectionObserver((entries, instance) => {
        if (!entries[0].isIntersecting) return;
        portrait.classList.add("is-frame-ready");
        instance.unobserve(portrait);
      }, { threshold: 0.25, rootMargin: "0px 0px -8%" });
      portraitObserver.observe(portrait);
    }
  };

  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, new Promise((r) => setTimeout(r, 1200))]).then(() => requestAnimationFrame(reveal));
}
