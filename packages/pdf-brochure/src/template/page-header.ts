import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { escapeHtml } from "../blocks/escape-html.js";
import type { BrochureContent } from "../schema/content.schema.js";

const logoPath = fileURLToPath(new URL("../../assets/images/logo.svg", import.meta.url));
const logoMarkup = readFileSync(logoPath, "utf-8");

/**
 * Rendered by Puppeteer as `page.pdf({ headerTemplate })`, so it runs in an isolated
 * print context: no access to styles.css or the document's fonts, everything must be
 * inline. Repeats on every page of the content PDF (the cover is generated separately
 * without a header, see render.ts).
 */
export function renderPageHeader(content: BrochureContent): string {
  return `<div style="width: 100%; box-sizing: border-box; padding: 0 12.7mm; margin-top: 8mm; display: flex; align-items: center; gap: 8px; font-family: Arial, Helvetica, sans-serif;">
    <style>.brochure-page-header__mark svg { width: 100%; height: 100%; display: block; }</style>
    <div class="brochure-page-header__mark" style="width: 20px; height: 20px; flex: 0 0 auto;">${logoMarkup}</div>
    <span style="font-size: 8.5px; font-weight: 800; letter-spacing: 0.04em; color: #0d8299; text-transform: uppercase;">${escapeHtml(content.companyName)}</span>
  </div>`;
}
