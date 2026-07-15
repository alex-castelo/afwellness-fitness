import type { Block } from "../schema/content.schema.js";
import { escapeHtml } from "./escape-html.js";

type PullQuoteBlock = Extract<Block, { type: "pullQuote" }>;

export function renderPullQuoteBlock(data: PullQuoteBlock): string {
  return `<section class="block block-pull-quote">
    <span class="block-pull-quote__bar block-pull-quote__bar--left"></span>
    <div class="block-pull-quote__content">
      <span class="block-pull-quote__mark">&ldquo;</span>
      <p class="block-pull-quote__text">${escapeHtml(data.quote)}</p>
    </div>
    <span class="block-pull-quote__bar block-pull-quote__bar--right"></span>
  </section>`;
}
