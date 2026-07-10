import type { Block } from "../schema/content.schema.js";
import { escapeHtml } from "./escape-html.js";

type BenefitsListBlock = Extract<Block, { type: "benefitsList" }>;

export function renderBenefitsListBlock(data: BenefitsListBlock): string {
  const heading = data.heading
    ? `<h2 class="block-benefits-list__heading">${escapeHtml(data.heading)}</h2>`
    : "";

  const items = data.items
    .map((item) => `<li class="block-benefits-list__item">${escapeHtml(item)}</li>`)
    .join("");

  return `<section class="block block-benefits-list">
    ${heading}
    <ul class="block-benefits-list__items">${items}</ul>
  </section>`;
}
