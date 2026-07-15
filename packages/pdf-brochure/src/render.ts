import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { PDFDocument } from "pdf-lib";
import puppeteer from "puppeteer";
import { validateContent } from "./schema/content.schema.js";
import { renderContentDocument, renderCoverDocument } from "./template/document.js";
import { renderPageFooter } from "./template/page-footer.js";
import { renderPageHeader } from "./template/page-header.js";
import { CONTENT_PAGE_MARGIN } from "./template/page-margin.js";

const ZERO_MARGIN = { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" };

export async function generatePdf(contentPath: string, outPath: string): Promise<void> {
  const raw = await readFile(contentPath, "utf-8");
  const data = JSON.parse(raw);
  const result = validateContent(data);

  if (!result.success) {
    const details = result.errors.map((message) => `  - ${message}`).join("\n");
    throw new Error(`Content at "${contentPath}" failed validation:\n${details}`);
  }

  const content = result.data;
  const coverHtml = await renderCoverDocument(content);
  const contentHtml = await renderContentDocument(content);

  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();

    await page.setContent(coverHtml, { waitUntil: "load" });
    const coverPdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: ZERO_MARGIN,
    });

    await page.setContent(contentHtml, { waitUntil: "load" });
    const contentPdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: CONTENT_PAGE_MARGIN,
      displayHeaderFooter: true,
      headerTemplate: renderPageHeader(content),
      footerTemplate: renderPageFooter(content),
    });

    const merged = await mergePdfs([coverPdf, contentPdf]);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, merged);
  } finally {
    await browser.close();
  }
}

async function mergePdfs(buffers: Uint8Array[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const buffer of buffers) {
    const source = await PDFDocument.load(buffer);
    const pages = await merged.copyPages(source, source.getPageIndices());
    for (const page of pages) merged.addPage(page);
  }
  return merged.save();
}
