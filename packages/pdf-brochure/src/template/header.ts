import { escapeHtml } from "../blocks/escape-html.js";
import type { BrochureContent } from "../schema/content.schema.js";

export function renderHeader(content: BrochureContent): string {
  return `<header class="brochure-header">
    <span class="brochure-header__company">${escapeHtml(content.companyName)}</span>
  </header>`;
}
