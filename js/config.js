/* Single source of truth for site-wide content. Edit here, not in the HTML. */
export const config = {
  site: {
    name: "Dr. Emmanuel A. Owolabi",
    monogram: "EAO",
    tagline: "Physician · Health Innovator · Institution Builder",
    email: "abiodunowolabi2000@gmail.com",
    year: new Date().getFullYear(),
  },

  // Navigation: `id` must match the section id in /sections/*.html
  nav: [
    { id: "about", label: "About" },
    { id: "work", label: "Work" },
    { id: "research", label: "Research" },
    { id: "speaking", label: "Speaking" },
    { id: "insights", label: "Insights" },
  ],
  navCta: { label: "Let's talk", target: "contact" },

  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "X", href: "https://x.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],

  // Components and sections are fetched in this order.
  components: {
    navbar: "components/navbar.html",
    footer: "components/footer.html",
  },
  sections: [
    "sections/home.html",
    "sections/about.html",
    "sections/selected-works.html",
    "sections/publications.html",
    "sections/impact.html",
    "sections/memory-wall.html",
    "sections/current-focus.html",
    "sections/contact.html",
  ],
};
