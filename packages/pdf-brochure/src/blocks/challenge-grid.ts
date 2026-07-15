import type { Block } from "../schema/content.schema.js";
import { escapeHtml } from "./escape-html.js";
import { renderIcon } from "./icons.js";

type ChallengeGridBlock = Extract<Block, { type: "challengeGrid" }>;

export function renderChallengeGridBlock(data: ChallengeGridBlock): string {
  const items = data.items
    .map((item) => {
      const consequences = item.consequences
        .map((consequence) => `<li>${escapeHtml(consequence)}</li>`)
        .join("");

      return `<div class="block-challenge-grid__item">
        <div class="block-challenge-grid__icon">${renderIcon(item.icon)}</div>
        <h3 class="block-challenge-grid__item-title">${escapeHtml(item.title)}</h3>
        <p class="block-challenge-grid__item-description">${escapeHtml(item.description)}</p>
        <p class="block-challenge-grid__consequences-label">Consecuencias</p>
        <ul class="block-challenge-grid__consequences">${consequences}</ul>
      </div>`;
    })
    .join("");

  return `<section class="block block-challenge-grid">
    <h2 class="block-challenge-grid__heading">
      <span></span>${escapeHtml(data.heading)}<span></span>
    </h2>
    <div class="block-challenge-grid__items block-challenge-grid__items--count-${data.items.length}">${items}</div>
  </section>`;
}
