import { escapeHtml } from "../blocks/escape-html.js";
import type { BrochureContent } from "../schema/content.schema.js";

export function renderFooter(content: BrochureContent): string {
  return `<footer class="brochure-footer">
    <div class="brochure-footer__brand">
      <span class="brochure-footer__brand-name">${escapeHtml(content.companyName.toUpperCase())}</span>
      <svg class="brochure-footer__pulse" viewBox="0 0 600 20" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          points="0,10 430,10 442,2 452,18 462,10 600,10"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <p class="brochure-footer__contact">${escapeHtml(content.address)} · ${escapeHtml(content.email)} · ${escapeHtml(content.phone)}</p>
    <p class="brochure-footer__links">${escapeHtml(content.website)} · ${escapeHtml(content.instagram)}</p>
  </footer>`;
}
