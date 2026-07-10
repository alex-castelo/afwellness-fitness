import { escapeHtml } from "../blocks/escape-html.js";
import type { BrochureContent } from "../schema/content.schema.js";

export function renderCover(content: BrochureContent): string {
  const logo = content.logoUrl
    ? `<img class="cover__logo" src="${escapeHtml(content.logoUrl)}" alt="${escapeHtml(content.companyName)}" />`
    : `<p class="cover__company-name">${escapeHtml(content.companyName)}</p>`;

  return `<section class="cover">
    ${logo}
    <p class="cover__tagline">Propuesta de bienestar corporativo</p>
  </section>`;
}
