/* Lightweight component loader: fetches HTML fragments and drops them into the page.
   Requires HTTP(S). It will not work from file:// — see README. */

async function fetchFragment(url) {
  const separator = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${separator}v=20261031`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return res.text();
}

/** Replace every <div data-component="path.html"> with the fetched markup. */
export async function loadComponents(root = document) {
  const slots = [...root.querySelectorAll("[data-component]")];
  await Promise.all(
    slots.map(async (slot) => {
      slot.innerHTML = await fetchFragment(slot.dataset.component);
      slot.removeAttribute("data-component");
    })
  );
}

/** Append sections, in order, into the <main> container. */
export async function loadSections(paths, container) {
  const html = await Promise.all(paths.map(fetchFragment));
  container.innerHTML = html.join("\n");
}

export function showLoadError(err) {
  console.error(err);
  const isFile = location.protocol === "file:";
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div class="load-error"><h1 class="h3">The site couldn't load its components.</h1>
     <p class="muted" style="margin-top:1rem">${
       isFile
         ? "This page was opened as a local file. Start a local server instead: run <code>python3 -m http.server 8000</code> in the project folder, then open <code>http://localhost:8000</code>."
         : "Check that the files in <code>components/</code> and <code>sections/</code> are uploaded. " + err.message
     }</p></div>`
  );
}
