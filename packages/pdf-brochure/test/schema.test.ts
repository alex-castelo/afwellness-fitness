import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { validateContent } from "../src/schema/content.schema.js";

function loadFixture(name: string): unknown {
  const path = fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));
  return JSON.parse(readFileSync(path, "utf-8"));
}

describe("validateContent", () => {
  it("accepts a fully valid brochure content fixture", () => {
    const result = validateContent(loadFixture("valid.json"));

    expect(result.success).toBe(true);
  });

  it("accepts content without a logoUrl, since the field is optional", () => {
    const result = validateContent(loadFixture("valid.json"));

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.logoUrl).toBeUndefined();
    }
  });

  it("rejects a block with an unrecognized type, identifying which block", () => {
    const result = validateContent(loadFixture("invalid-unknown-block-type.json"));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join("\n")).toMatch(/blocks\.0/);
    }
  });

  it("rejects a block missing a required field, identifying the field", () => {
    const result = validateContent(loadFixture("invalid-missing-required-field.json"));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join("\n")).toMatch(/blocks\.0\.body/);
    }
  });

  it("rejects a gallery block with fewer than the minimum 1 image", () => {
    const result = validateContent(loadFixture("invalid-gallery-bounds.json"));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join("\n")).toMatch(/blocks\.0\.images/);
    }
  });

  it("rejects a gallery block with more than the maximum 6 images", () => {
    const tooManyImages = {
      ...(loadFixture("valid.json") as Record<string, unknown>),
      blocks: [
        {
          type: "gallery",
          images: Array.from({ length: 7 }, (_, i) => ({
            url: `./assets/images/foto-${i}.jpg`,
            alt: `Foto ${i}`,
          })),
        },
      ],
    };

    const result = validateContent(tooManyImages);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join("\n")).toMatch(/blocks\.0\.images/);
    }
  });

  it("rejects content missing the cover title", () => {
    const missingCoverTitle = {
      ...(loadFixture("valid.json") as Record<string, unknown>),
      cover: { tagline: "Transformamos salud en rendimiento." },
    };

    const result = validateContent(missingCoverTitle);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join("\n")).toMatch(/cover\.title/);
    }
  });

  it("accepts a cover without optional subtitle, pillars, or location", () => {
    const minimalCover = {
      ...(loadFixture("valid.json") as Record<string, unknown>),
      cover: { title: "CORPORATE WELLNESS", tagline: "Transformamos salud en rendimiento." },
    };

    const result = validateContent(minimalCover);

    expect(result.success).toBe(true);
  });

  it("rejects content missing required document metadata", () => {
    const missingCompanyName = {
      ...(loadFixture("valid.json") as Record<string, unknown>),
      companyName: undefined,
    };

    const result = validateContent(missingCompanyName);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join("\n")).toMatch(/companyName/);
    }
  });
});
