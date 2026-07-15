import { escapeHtml } from "../blocks/escape-html.js";
import type { BrochureContent } from "../schema/content.schema.js";

/**
 * Rendered by Puppeteer as `page.pdf({ footerTemplate })` — same isolated print
 * context as page-header.ts. `pageNumber`/`totalPages` are special classes Chromium
 * fills in per page; they count only the pages of this PDF (the content pages), the
 * cover isn't part of the count since it's generated as a separate PDF and merged in.
 */
export function renderPageFooter(content: BrochureContent): string {
  return `<div style="width: 100%; box-sizing: border-box; padding: 0 12.7mm; margin-bottom: 8mm; display: flex; align-items: center; gap: 14px; font-family: Arial, Helvetica, sans-serif;">
    <span style="font-size: 9px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: #1a1a1a; white-space: nowrap;">${escapeHtml(content.companyName)}</span>
    <svg style="flex: 1; height: 11px; color: #0d8299;" viewBox="0 0 600 20" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points="0,10 430,10 442,2 452,18 462,10 600,10"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span style="font-size: 8px; color: #555555; white-space: nowrap;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
  </div>`;
}
