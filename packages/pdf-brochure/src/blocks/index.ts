import type { Block } from "../schema/content.schema.js";
import { renderBenefitsListBlock } from "./benefits-list.js";
import { renderChallengeGridBlock } from "./challenge-grid.js";
import { renderGalleryBlock } from "./gallery.js";
import { renderHeroBlock } from "./hero.js";
import { renderPricingTableBlock } from "./pricing-table.js";
import { renderPullQuoteBlock } from "./pull-quote.js";
import { renderStatHighlightsBlock } from "./stat-highlights.js";
import { renderTestimonialBlock } from "./testimonial.js";
import { renderTextBlock } from "./text.js";
import { renderTextImageBlock } from "./text-image.js";

type Renderer<T extends Block["type"]> = (data: Extract<Block, { type: T }>) => string;

const registry: Partial<{ [K in Block["type"]]: Renderer<K> }> = {
  text: renderTextBlock,
  textImage: renderTextImageBlock,
  benefitsList: renderBenefitsListBlock,
  pricingTable: renderPricingTableBlock,
  testimonial: renderTestimonialBlock,
  gallery: renderGalleryBlock,
  hero: renderHeroBlock,
  challengeGrid: renderChallengeGridBlock,
  statHighlights: renderStatHighlightsBlock,
  pullQuote: renderPullQuoteBlock,
};

export function renderBlock(block: Block): string {
  const renderer = registry[block.type];

  if (!renderer) {
    throw new Error(`No block renderer registered for type "${block.type}"`);
  }

  return (renderer as Renderer<typeof block.type>)(block);
}
