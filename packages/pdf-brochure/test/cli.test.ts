import { describe, expect, it } from "vitest";
import { parseArgs } from "../src/cli.js";

describe("parseArgs", () => {
  it("parses the generate command with default content and out paths", () => {
    const result = parseArgs(["generate"]);

    expect(result).toEqual({
      command: "generate",
      content: "./src/content/brochure.json",
      out: "./output/brochure.pdf",
    });
  });

  it("parses the validate command with default content path", () => {
    const result = parseArgs(["validate"]);

    expect(result.command).toBe("validate");
    expect(result.content).toBe("./src/content/brochure.json");
  });

  it("overrides content and out paths when flags are provided", () => {
    const result = parseArgs([
      "generate",
      "--content",
      "./custom/content.json",
      "--out",
      "./custom/out.pdf",
    ]);

    expect(result.content).toBe("./custom/content.json");
    expect(result.out).toBe("./custom/out.pdf");
  });

  it("throws a clear error for an unknown command", () => {
    expect(() => parseArgs(["frobnicate"])).toThrow(/Unknown command "frobnicate"/);
  });

  it("throws a clear error when no command is given", () => {
    expect(() => parseArgs([])).toThrow(/Expected "generate" or "validate"/);
  });

  it("throws a clear error for an unrecognized flag", () => {
    expect(() => parseArgs(["generate", "--bogus"])).toThrow(/Unknown flag "--bogus"/);
  });

  it("throws a clear error when --content is missing its value", () => {
    expect(() => parseArgs(["generate", "--content"])).toThrow(/--content requires a value/);
  });
});
