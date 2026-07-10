import { describe, expect, it } from "vitest";
import { renderBenefitsListBlock } from "../src/blocks/benefits-list.js";
import { renderBlock } from "../src/blocks/index.js";
import { renderTextBlock } from "../src/blocks/text.js";
import { renderTextImageBlock } from "../src/blocks/text-image.js";

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

describe("renderTextImageBlock", () => {
  it("renders the image with its alt text and the body text", () => {
    const html = renderTextImageBlock({
      type: "textImage",
      body: "Entrenamiento personalizado para tu equipo.",
      imageUrl: "./assets/images/equipo.jpg",
      imageAlt: "Equipo entrenando",
      imagePosition: "right",
    });

    expect(html).toContain('src="./assets/images/equipo.jpg"');
    expect(html).toContain('alt="Equipo entrenando"');
    expect(html).toContain("Entrenamiento personalizado para tu equipo.");
  });

  it("renders an optional heading when provided", () => {
    const html = renderTextImageBlock({
      type: "textImage",
      heading: "Nuestro enfoque",
      body: "Cuerpo",
      imageUrl: "img.jpg",
      imageAlt: "alt",
      imagePosition: "left",
    });

    expect(html).toContain('class="block-text-image__heading"');
    expect(html).toContain("Nuestro enfoque");
  });

  it("reflects the image position in the wrapper class", () => {
    const html = renderTextImageBlock({
      type: "textImage",
      body: "Cuerpo",
      imageUrl: "img.jpg",
      imageAlt: "alt",
      imagePosition: "left",
    });

    expect(html).toContain("block-text-image--left");
  });

  it("escapes HTML-significant characters in the alt text", () => {
    const html = renderTextImageBlock({
      type: "textImage",
      body: "Cuerpo",
      imageUrl: "img.jpg",
      imageAlt: '"><script>alert(1)</script>',
      imagePosition: "right",
    });

    expect(html).not.toContain("<script>");
  });
});

describe("renderBenefitsListBlock", () => {
  it("renders each item as a list entry", () => {
    const html = renderBenefitsListBlock({
      type: "benefitsList",
      items: ["Más energía", "Menos bajas laborales", "Equipos más cohesionados"],
    });

    expect(html).toContain("Más energía");
    expect(html).toContain("Menos bajas laborales");
    expect(html).toContain("Equipos más cohesionados");
    expect(html.match(/<li /g)).toHaveLength(3);
  });

  it("renders an optional heading when provided", () => {
    const html = renderBenefitsListBlock({
      type: "benefitsList",
      heading: "Beneficios",
      items: ["Uno"],
    });

    expect(html).toContain('class="block-benefits-list__heading"');
    expect(html).toContain("Beneficios");
  });

  it("omits the heading element when not provided", () => {
    const html = renderBenefitsListBlock({ type: "benefitsList", items: ["Uno"] });

    expect(html).not.toContain("block-benefits-list__heading");
  });

  it("escapes HTML-significant characters in items", () => {
    const html = renderBenefitsListBlock({
      type: "benefitsList",
      items: ["<script>alert(1)</script>"],
    });

    expect(html).not.toContain("<script>");
  });
});

describe("renderBlock registry", () => {
  it("dispatches a text block to renderTextBlock", () => {
    const html = renderBlock({ type: "text", body: "Contenido" });

    expect(html).toContain("Contenido");
  });

  it("dispatches a textImage block to renderTextImageBlock", () => {
    const html = renderBlock({
      type: "textImage",
      body: "Cuerpo",
      imageUrl: "img.jpg",
      imageAlt: "alt",
      imagePosition: "right",
    });

    expect(html).toContain("Cuerpo");
  });

  it("dispatches a benefitsList block to renderBenefitsListBlock", () => {
    const html = renderBlock({ type: "benefitsList", items: ["Beneficio uno"] });

    expect(html).toContain("Beneficio uno");
  });

  it("throws a clear error identifying an unregistered block type", () => {
    const galleryBlock = {
      type: "gallery" as const,
      images: [{ url: "foto.jpg", alt: "Foto" }],
    };

    expect(() => renderBlock(galleryBlock)).toThrow(/gallery/);
  });
});
