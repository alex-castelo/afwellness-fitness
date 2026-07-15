import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Block } from "../schema/content.schema.js";
import { escapeHtml } from "./escape-html.js";

type HeroBlock = Extract<Block, { type: "hero" }>;

const logoPath = fileURLToPath(new URL("../../assets/images/logo.svg", import.meta.url));
const logoMarkup = readFileSync(logoPath, "utf-8");

export function renderHeroBlock(data: HeroBlock): string {
  const emphasis = data.emphasis
    ? `<p class="block-hero__emphasis">${escapeHtml(data.emphasis)}</p>`
    : "";

  return `<section class="block block-hero">
    <img class="block-hero__image" src="${escapeHtml(data.imageUrl)}" alt="${escapeHtml(data.imageAlt)}" />
    <div class="block-hero__scrim"></div>
    <div class="block-hero__content">
      <div class="block-hero__logo">${logoMarkup}</div>
      <h1 class="block-hero__heading">
        <span class="block-hero__heading-base">${escapeHtml(data.heading)}</span>
        <span class="block-hero__heading-highlight">${escapeHtml(data.headingHighlight)}</span>
      </h1>
      <span class="block-hero__divider"></span>
      <p class="block-hero__body">${escapeHtml(data.body)}</p>
      ${emphasis}
    </div>
  </section>`;
}
