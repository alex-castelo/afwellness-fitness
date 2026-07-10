import { mkdir, readFile } from "node:fs/promises";
import { dirname } from "node:path";
import puppeteer from "puppeteer";
import { validateContent } from "./schema/content.schema.js";
import { renderDocument } from "./template/document.js";

export async function generatePdf(contentPath: string, outPath: string): Promise<void> {
  const raw = await readFile(contentPath, "utf-8");
  const data = JSON.parse(raw);
  const result = validateContent(data);

  if (!result.success) {
    const details = result.errors.map((message) => `  - ${message}`).join("\n");
    throw new Error(`Content at "${contentPath}" failed validation:\n${details}`);
  }

  const html = await renderDocument(result.data);

  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await mkdir(dirname(outPath), { recursive: true });
    await page.pdf({ path: outPath, format: "A4", printBackground: true });
  } finally {
    await browser.close();
  }
}
