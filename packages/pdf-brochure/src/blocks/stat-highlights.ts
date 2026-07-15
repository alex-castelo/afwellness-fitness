import type { Block } from "../schema/content.schema.js";
import { escapeHtml } from "./escape-html.js";
import { renderIcon } from "./icons.js";

type StatHighlightsBlock = Extract<Block, { type: "statHighlights" }>;

export function renderStatHighlightsBlock(data: StatHighlightsBlock): string {
  const description = data.description
    ? `<p class="block-stat-highlights__description">${escapeHtml(data.description)}</p>`
    : "";

  const items = data.items
    .map(
      (item) => `<div class="block-stat-highlights__item">
        <div class="block-stat-highlights__icon">${renderIcon(item.icon)}</div>
        <p class="block-stat-highlights__label">${escapeHtml(item.label)}</p>
      </div>`,
    )
    .join("");

  return `<section class="block block-stat-highlights">
    <h2 class="block-stat-highlights__heading">${escapeHtml(data.heading)}</h2>
    ${description}
    <div class="block-stat-highlights__items">${items}</div>
  </section>`;
}
