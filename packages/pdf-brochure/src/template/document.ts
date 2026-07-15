import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { escapeHtml } from "../blocks/escape-html.js";
import { renderBlock } from "../blocks/index.js";
import type { BrochureContent } from "../schema/content.schema.js";
import { renderCover } from "./cover.js";
import { renderFooter } from "./footer.js";
import { contentPageMarginCss } from "./page-margin.js";

const stylesPath = fileURLToPath(new URL("./styles.css", import.meta.url));

/**
 * Rendered as its own PDF (no Puppeteer header/footer, zero margin) so the cover
 * photo can bleed to the true page edge — see render.ts.
 */
export async function renderCoverDocument(content: BrochureContent): Promise<string> {
  const styles = await readFile(stylesPath, "utf-8");
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
  </body>
</html>`;
}

/**
 * Rendered as its own PDF with Puppeteer's headerTemplate/footerTemplate + margin
 * enabled, so every page gets the repeating logo header, "Página X de Y" footer, and
 * consistent padding — see render.ts.
 */
export async function renderContentDocument(content: BrochureContent): Promise<string> {
  const styles = await readFile(stylesPath, "utf-8");
  const blocksHtml = content.blocks.map(renderBlock).join("\n");

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(content.companyName)}</title>
    <style>${styles}
${contentPageMarginCss}</style>
  </head>
  <body>
    <main class="brochure-content">
      ${blocksHtml}
    </main>
    ${renderFooter(content)}
  </body>
</html>`;
}
