import { describe, expect, it } from "vitest";
import { renderBlock } from "../src/blocks/index.js";
import { renderTextBlock } from "../src/blocks/text.js";

describe("renderTextBlock", () => {
  it("renders the body inside a block-text wrapper", () => {
    const html = renderTextBlock({ type: "text", body: "Hola mundo" });

    expect(html).toContain('class="block block-text"');
    expect(html).toContain("Hola mundo");
  });

  it("renders an optional heading when provided", () => {
    const html = renderTextBlock({ type: "text", heading: "Título", body: "Cuerpo" });

    expect(html).toContain('class="block-text__heading"');
    expect(html).toContain("Título");
  });

  it("omits the heading element when not provided", () => {
    const html = renderTextBlock({ type: "text", body: "Solo cuerpo" });

    expect(html).not.toContain("block-text__heading");
  });

  it("escapes HTML-significant characters in the body", () => {
    const html = renderTextBlock({ type: "text", body: "<script>alert(1)</script>" });

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("renderBlock registry", () => {
  it("dispatches a text block to renderTextBlock", () => {
    const html = renderBlock({ type: "text", body: "Contenido" });

    expect(html).toContain("Contenido");
  });

  it("throws a clear error identifying an unregistered block type", () => {
    const galleryBlock = {
      type: "gallery" as const,
      images: [{ url: "foto.jpg", alt: "Foto" }],
    };

    expect(() => renderBlock(galleryBlock)).toThrow(/gallery/);
  });
});
