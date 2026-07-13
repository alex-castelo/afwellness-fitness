import { escapeHtml } from "../blocks/escape-html.js";
import type { BrochureContent } from "../schema/content.schema.js";

export function renderCover(content: BrochureContent): string {
  const { cover } = content;

  const logo = content.logoUrl
    ? `<img class="cover__logo" src="${escapeHtml(content.logoUrl)}" alt="${escapeHtml(content.companyName)}" />`
    : `<p class="cover__company-name">${escapeHtml(content.companyName)}</p>`;

  const subtitle = cover.subtitle
    ? `<p class="cover__subtitle">${escapeHtml(cover.subtitle)}</p>`
    : "";

  const pillars = cover.pillars?.length
    ? `<ul class="cover__pillars">${cover.pillars
        .map((pillar) => `<li class="cover__pillar">${escapeHtml(pillar)}</li>`)
        .join("")}</ul>`
    : "";

  const location = cover.location
    ? `<div class="cover__location">
        <p class="cover__location-title">${escapeHtml(cover.location.title)}</p>
        <p class="cover__location-description">${escapeHtml(cover.location.description)}</p>
      </div>`
    : "";

  return `<section class="cover">
    ${logo}
    <h1 class="cover__title">${escapeHtml(cover.title)}</h1>
    <p class="cover__tagline">${escapeHtml(cover.tagline)}</p>
    ${subtitle}
    ${pillars}
    ${location}
  </section>`;
}
