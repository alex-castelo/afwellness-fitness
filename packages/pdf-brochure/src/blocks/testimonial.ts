import type { Block } from "../schema/content.schema.js";
import { escapeHtml } from "./escape-html.js";

type TestimonialBlock = Extract<Block, { type: "testimonial" }>;

export function renderTestimonialBlock(data: TestimonialBlock): string {
  const role = data.role ? `<p class="block-testimonial__role">${escapeHtml(data.role)}</p>` : "";

  return `<section class="block block-testimonial">
    <blockquote class="block-testimonial__quote">${escapeHtml(data.quote)}</blockquote>
    <p class="block-testimonial__author">${escapeHtml(data.author)}</p>
    ${role}
  </section>`;
}
