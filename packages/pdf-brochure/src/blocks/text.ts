import type { Block } from "../schema/content.schema.js";
import { escapeHtml } from "./escape-html.js";

type TextBlock = Extract<Block, { type: "text" }>;

export function renderTextBlock(data: TextBlock): string {
  const heading = data.heading
    ? `<h2 class="block-text__heading">${escapeHtml(data.heading)}</h2>`
    : "";

  return `<section class="block block-text">${heading}<p class="block-text__body">${escapeHtml(data.body)}</p></section>`;
}
