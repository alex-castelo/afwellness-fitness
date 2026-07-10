import { escapeHtml } from "../blocks/escape-html.js";
import type { BrochureContent } from "../schema/content.schema.js";

export function renderFooter(content: BrochureContent): string {
  return `<footer class="brochure-footer">
    <p class="brochure-footer__contact">${escapeHtml(content.address)} · ${escapeHtml(content.email)} · ${escapeHtml(content.phone)}</p>
    <p class="brochure-footer__links">${escapeHtml(content.website)} · ${escapeHtml(content.instagram)}</p>
  </footer>`;
}
