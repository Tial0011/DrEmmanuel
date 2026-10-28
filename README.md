# Dr. Emmanuel A. Owolabi: Portfolio (Stage 1 of 5)

Plain HTML, CSS and vanilla JavaScript. No framework, no build step.

## Run it locally

The site loads its components and sections with `fetch()`, so it must be served over HTTP. Opening `index.html` directly (`file://`) will show a message explaining this.

```bash
cd dr-emmanuel-owolabi-portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

(Any static server works: `npx serve`, VS Code Live Server, and so on.)

## Deploy

Upload the folder as is to Netlify, GitHub Pages or any static host. No build command; publish directory is the project root.

## Architecture

| Folder | Purpose |
|---|---|
| `components/` | Reusable fragments (navbar, footer, scroll indicator) |
| `sections/` | One file per page section, loaded in order into `<main>` |
| `css/` | `variables.css` holds every colour, size and font token; `components/` has one stylesheet per component |
| `js/config.js` | Single source of truth: name, email, nav links, socials, section order |
| `js/component-loader.js` | Fetches fragments and inserts them |

**Why fetch-based components:** it keeps each section in its own file, so later stages add or replace a section without touching the others. The trade-off is that it needs a server; a static host provides one.

## Adding or editing

- **Nav link or section order:** edit `js/config.js` (`nav` and `sections`). A nav item's `id` must match the section's `id`.
- **Colours and type:** edit `css/variables.css` only.
- **Email and socials:** `js/config.js`, plus the three social links in `components/footer.html` (currently generic placeholders).
- **Portrait:** replace `assets/images/portrait.jpg` with a high-resolution photo (about 1200px wide). The current file is a temporary crop from a phone screenshot. If the file is missing, `portrait-placeholder.svg` is used.

## Motion

One orchestrated moment: the hero entrance and the pulse line drawing itself. Everything respects `prefers-reduced-motion`.

## Status

Stage 1 delivers the foundation, design system, navbar, hero and footer. About has real copy; the other sections are labelled placeholders for stages 2 to 5.
