import { describe, expect, it } from "vitest";
import { renderBenefitsListBlock } from "../src/blocks/benefits-list.js";
import { renderGalleryBlock } from "../src/blocks/gallery.js";
import { renderBlock } from "../src/blocks/index.js";
import { renderPricingTableBlock } from "../src/blocks/pricing-table.js";
import { renderTestimonialBlock } from "../src/blocks/testimonial.js";
import { renderTextBlock } from "../src/blocks/text.js";
import { renderTextImageBlock } from "../src/blocks/text-image.js";
import type { Block } from "../src/schema/content.schema.js";

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

describe("renderPricingTableBlock", () => {
  it("renders each tier's name, price, and features", () => {
    const html = renderPricingTableBlock({
      type: "pricingTable",
      tiers: [
        { name: "Básico", price: "300€/mes", features: ["2 sesiones semanales"] },
        { name: "Premium", price: "600€/mes", features: ["4 sesiones semanales", "Nutrición"] },
      ],
    });

    expect(html).toContain("Básico");
    expect(html).toContain("300€/mes");
    expect(html).toContain("2 sesiones semanales");
    expect(html).toContain("Premium");
    expect(html).toContain("Nutrición");
    expect(html.match(/block-pricing-table__tier"/g)).toHaveLength(2);
  });

  it("marks a highlighted tier with a distinct class", () => {
    const html = renderPricingTableBlock({
      type: "pricingTable",
      tiers: [
        { name: "Premium", price: "600€/mes", features: ["Todo incluido"], highlighted: true },
      ],
    });

    expect(html).toContain("block-pricing-table__tier--highlighted");
  });

  it("renders an optional heading when provided", () => {
    const html = renderPricingTableBlock({
      type: "pricingTable",
      heading: "Planes",
      tiers: [{ name: "Básico", price: "300€", features: ["Feature"] }],
    });

    expect(html).toContain('class="block-pricing-table__heading"');
    expect(html).toContain("Planes");
  });

  it("escapes HTML-significant characters in tier fields", () => {
    const html = renderPricingTableBlock({
      type: "pricingTable",
      tiers: [{ name: "<script>alert(1)</script>", price: "0€", features: ["Feature"] }],
    });

    expect(html).not.toContain("<script>");
  });
});

describe("renderTestimonialBlock", () => {
  it("renders the quote and author", () => {
    const html = renderTestimonialBlock({
      type: "testimonial",
      quote: "El equipo llegó con más energía a fin de año.",
      author: "María, Directora de RRHH",
    });

    expect(html).toContain("El equipo llegó con más energía a fin de año.");
    expect(html).toContain("María, Directora de RRHH");
  });

  it("renders an optional role when provided", () => {
    const html = renderTestimonialBlock({
      type: "testimonial",
      quote: "Quote",
      author: "Autor",
      role: "CEO, Empresa X",
    });

    expect(html).toContain('class="block-testimonial__role"');
    expect(html).toContain("CEO, Empresa X");
  });

  it("omits the role element when not provided", () => {
    const html = renderTestimonialBlock({ type: "testimonial", quote: "Quote", author: "Autor" });

    expect(html).not.toContain("block-testimonial__role");
  });

  it("escapes HTML-significant characters in the quote", () => {
    const html = renderTestimonialBlock({
      type: "testimonial",
      quote: "<script>alert(1)</script>",
      author: "Autor",
    });

    expect(html).not.toContain("<script>");
  });
});

describe("renderGalleryBlock", () => {
  it("renders a single image gracefully", () => {
    const html = renderGalleryBlock({
      type: "gallery",
      images: [{ url: "foto-1.jpg", alt: "Foto 1" }],
    });

    expect(html).toContain('src="foto-1.jpg"');
    expect(html.match(/<img /g)).toHaveLength(1);
  });

  it("renders all six images when at the upper bound", () => {
    const html = renderGalleryBlock({
      type: "gallery",
      images: Array.from({ length: 6 }, (_, i) => ({ url: `foto-${i}.jpg`, alt: `Foto ${i}` })),
    });

    expect(html.match(/<img /g)).toHaveLength(6);
  });

  it("renders an optional heading when provided", () => {
    const html = renderGalleryBlock({
      type: "gallery",
      heading: "Galería",
      images: [{ url: "foto.jpg", alt: "Foto" }],
    });

    expect(html).toContain('class="block-gallery__heading"');
    expect(html).toContain("Galería");
  });

  it("escapes HTML-significant characters in alt text", () => {
    const html = renderGalleryBlock({
      type: "gallery",
      images: [{ url: "foto.jpg", alt: '"><script>alert(1)</script>' }],
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

  it("dispatches a pricingTable block to renderPricingTableBlock", () => {
    const html = renderBlock({
      type: "pricingTable",
      tiers: [{ name: "Básico", price: "300€", features: ["Feature"] }],
    });

    expect(html).toContain("Básico");
  });

  it("dispatches a testimonial block to renderTestimonialBlock", () => {
    const html = renderBlock({ type: "testimonial", quote: "Quote", author: "Autor" });

    expect(html).toContain("Quote");
  });

  it("dispatches a gallery block to renderGalleryBlock", () => {
    const html = renderBlock({
      type: "gallery",
      images: [{ url: "foto.jpg", alt: "Foto" }],
    });

    expect(html).toContain('src="foto.jpg"');
  });

  it("throws a clear error identifying an unregistered block type", () => {
    const bogusBlock = { type: "carousel", images: ["a.jpg"] } as unknown as Block;

    expect(() => renderBlock(bogusBlock)).toThrow(/carousel/);
  });
});
