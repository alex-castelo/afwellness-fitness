import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { escapeHtml } from "../blocks/escape-html.js";
import { renderBlock } from "../blocks/index.js";
import type { BrochureContent } from "../schema/content.schema.js";
import { renderCover } from "./cover.js";
import { renderFooter } from "./footer.js";

const stylesPath = fileURLToPath(new URL("./styles.css", import.meta.url));

export async function renderDocument(content: BrochureContent): Promise<string> {
  const styles = await readFile(stylesPath, "utf-8");
  const blocksHtml = content.blocks.map(renderBlock).join("\n");
  const coverHtml = await renderCover(content);

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(content.companyName)}</title>
    <style>${styles}</style>
  </head>
  <body>
    ${coverHtml}
    <main class="brochure-content">
      ${blocksHtml}
    </main>
    ${renderFooter(content)}
  </body>
</html>`;
}
