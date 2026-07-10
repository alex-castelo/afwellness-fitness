import type { Block } from "../schema/content.schema.js";
import { escapeHtml } from "./escape-html.js";

type PricingTableBlock = Extract<Block, { type: "pricingTable" }>;

export function renderPricingTableBlock(data: PricingTableBlock): string {
  const heading = data.heading
    ? `<h2 class="block-pricing-table__heading">${escapeHtml(data.heading)}</h2>`
    : "";

  const tiers = data.tiers
    .map((tier) => {
      const highlightedClass = tier.highlighted ? " block-pricing-table__tier--highlighted" : "";
      const features = tier.features
        .map((feature) => `<li class="block-pricing-table__feature">${escapeHtml(feature)}</li>`)
        .join("");

      return `<div class="block-pricing-table__tier${highlightedClass}">
        <p class="block-pricing-table__tier-name">${escapeHtml(tier.name)}</p>
        <p class="block-pricing-table__tier-price">${escapeHtml(tier.price)}</p>
        <ul class="block-pricing-table__features">${features}</ul>
      </div>`;
    })
    .join("");

  return `<section class="block block-pricing-table">
    ${heading}
    <div class="block-pricing-table__tiers">${tiers}</div>
  </section>`;
}
