import type { Block } from "../schema/content.schema.js";
import { escapeHtml } from "./escape-html.js";

type TextImageBlock = Extract<Block, { type: "textImage" }>;

export function renderTextImageBlock(data: TextImageBlock): string {
  const heading = data.heading
    ? `<h2 class="block-text-image__heading">${escapeHtml(data.heading)}</h2>`
    : "";

  return `<section class="block block-text-image block-text-image--${data.imagePosition}">
    <div class="block-text-image__media">
      <img class="block-text-image__image" src="${escapeHtml(data.imageUrl)}" alt="${escapeHtml(data.imageAlt)}" />
    </div>
    <div class="block-text-image__content">
      ${heading}
      <p class="block-text-image__body">${escapeHtml(data.body)}</p>
    </div>
  </section>`;
}
