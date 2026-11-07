import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const templatePath = resolve(root, "index.template.html");
const outputPath = resolve(root, "index.html");
const template = await readFile(templatePath, "utf8");
const includePattern = /<!-- include:([a-zA-Z0-9_./-]+) -->/g;
const includes = [...template.matchAll(includePattern)];

if (includes.length === 0) {
  throw new Error("No fragment includes found in index.template.html");
}

let html = template;
for (const [marker, relativePath] of includes) {
  const fragmentPath = resolve(root, relativePath);
  if (!fragmentPath.startsWith(`${root}\\`) && !fragmentPath.startsWith(`${root}/`)) {
    throw new Error(`Fragment path must stay inside the project: ${relativePath}`);
  }
  const fragment = await readFile(fragmentPath, "utf8");
  html = html.replace(marker, fragment.trim());
}

if (includePattern.test(html)) {
  throw new Error("Unresolved fragment include found in generated homepage");
}

await writeFile(outputPath, html);
console.log(`Generated ${outputPath} from ${includes.length} fragments.`);
