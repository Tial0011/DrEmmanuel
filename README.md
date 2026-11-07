# Dr. Emmanuel A. Owolabi: Portfolio (Stage 1 of 5)

Plain HTML, CSS and vanilla JavaScript. No framework or runtime build step.

## Run it locally

The homepage is generated as static HTML so crawlers and visitors can read its content without JavaScript. Run the generator after editing the homepage template, components or sections:

```bash
node scripts/build-homepage.mjs
```

The generated `index.html` is committed and served directly. JavaScript progressively adds the interactive navigation, animation and gallery features. To preview locally, serve the project over HTTP:

```bash
cd dr-emmanuel-owolabi-portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

(Any static server works: `npx serve`, VS Code Live Server, and so on.)

## Deploy

Upload the folder as is to Netlify, GitHub Pages or any static host; publish directory is the project root. Regenerate `index.html` and commit it whenever you change its template or included fragments.

## Architecture

| Folder | Purpose |
|---|---|
| `components/` | Reusable fragments (navbar, footer, scroll indicator) |
| `sections/` | One file per homepage section, included in order in the generated `<main>` |
| `index.template.html` | Homepage template and list of fragments to include |
| `index.html` | Generated, crawler-readable homepage served by static hosts |
| `scripts/build-homepage.mjs` | Builds `index.html` from the template and its fragments |
| `css/` | `variables.css` holds every colour, size and font token; `components/` has one stylesheet per component |
| `js/config.js` | Single source of truth: name, email, nav links, socials, section order |
| `js/component-loader.js` | Fetches fragments only as a fallback when a page has not been pre-rendered |

**Why generated HTML:** section files remain easy to edit independently, while the generated homepage contains their full markup in the initial response. This lets crawlers read the page without rendering JavaScript.

## Adding or editing

- **Nav links:** edit `js/config.js` (`nav`). A nav item's `id` must match the section's `id`.
- **Homepage section order:** edit the `include:sections/...` entries in `index.template.html`, then run `node scripts/build-homepage.mjs`.
- **Homepage section content:** edit its file in `sections/`, then run `node scripts/build-homepage.mjs`.
- **Colours and type:** edit `css/variables.css` only.
- **Email and socials:** `js/config.js`, plus the three social links in `components/footer.html` (currently generic placeholders).
- **Portrait:** replace `assets/images/portrait.jpg` with a high-resolution photo (about 1200px wide). The current file is a temporary crop from a phone screenshot. If the file is missing, `portrait-placeholder.svg` is used.

## Motion

One orchestrated moment: the hero entrance and the pulse line drawing itself. Everything respects `prefers-reduced-motion`.

## Status

Stage 1 delivers the foundation, design system, navbar, hero and footer. About has real copy; the other sections are labelled placeholders for stages 2 to 5.
