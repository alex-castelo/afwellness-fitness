import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { generatePdf } from "./render.js";
import { validateContent } from "./schema/content.schema.js";

export type Command = "generate" | "validate";

export interface ParsedArgs {
  command: Command;
  content: string;
  out: string;
}

const DEFAULT_CONTENT_PATH = "./src/content/brochure.json";
const DEFAULT_OUT_PATH = "./output/brochure.pdf";

export function parseArgs(argv: string[]): ParsedArgs {
  const [command, ...rest] = argv;

  if (command !== "generate" && command !== "validate") {
    throw new Error(`Unknown command "${command ?? ""}". Expected "generate" or "validate".`);
  }

  let content = DEFAULT_CONTENT_PATH;
  let out = DEFAULT_OUT_PATH;

  for (let i = 0; i < rest.length; i += 1) {
    const flag = rest[i];
    if (flag === "--content") {
      const value = rest[i + 1];
      if (!value) throw new Error("--content requires a value");
      content = value;
      i += 1;
    } else if (flag === "--out") {
      const value = rest[i + 1];
      if (!value) throw new Error("--out requires a value");
      out = value;
      i += 1;
    } else {
      throw new Error(`Unknown flag "${flag}"`);
    }
  }

  return { command, content, out };
}

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv.slice(2));

  if (parsed.command === "generate") {
    await runGenerate(parsed.content, parsed.out);
    return;
  }

  await runValidate(parsed.content);
}

async function runGenerate(contentPath: string, outPath: string): Promise<void> {
  await generatePdf(contentPath, outPath);
  console.log(`✓ Generated ${outPath}`);
}

async function runValidate(contentPath: string): Promise<void> {
  const raw = await readFile(contentPath, "utf-8");
  const data = JSON.parse(raw);
  const result = validateContent(data);

  if (result.success) {
    console.log(`✓ ${contentPath} is valid.`);
    return;
  }

  console.error(`✗ ${contentPath} is invalid:`);
  for (const message of result.errors) {
    console.error(`  - ${message}`);
  }
  process.exitCode = 1;
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
