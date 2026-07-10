import type { Block } from "../schema/content.schema.js";
import { escapeHtml } from "./escape-html.js";

type GalleryBlock = Extract<Block, { type: "gallery" }>;

export function renderGalleryBlock(data: GalleryBlock): string {
  const heading = data.heading
    ? `<h2 class="block-gallery__heading">${escapeHtml(data.heading)}</h2>`
    : "";

  const images = data.images
    .map(
      (image) =>
        `<img class="block-gallery__image" src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt)}" />`,
    )
    .join("");

  return `<section class="block block-gallery block-gallery--count-${data.images.length}">
    ${heading}
    <div class="block-gallery__grid">${images}</div>
  </section>`;
}
