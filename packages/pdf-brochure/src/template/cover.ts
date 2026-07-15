import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { escapeHtml } from "../blocks/escape-html.js";
import type { BrochureContent } from "../schema/content.schema.js";

const coverImagePath = fileURLToPath(new URL("../../assets/images/cover.jpg", import.meta.url));

let cachedCoverImageDataUrl: string | undefined;

async function getCoverImageDataUrl(): Promise<string> {
  if (!cachedCoverImageDataUrl) {
    const buffer = await readFile(coverImagePath);
    cachedCoverImageDataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
  }
  return cachedCoverImageDataUrl;
}

export async function renderCover(content: BrochureContent): Promise<string> {
  const { cover } = content;
  const coverImageDataUrl = await getCoverImageDataUrl();

  return `<section class="cover">
    <img class="cover__image" src="${coverImageDataUrl}" alt="${escapeHtml(cover.title)} — ${escapeHtml(cover.tagline)}" />
  </section>`;
}
