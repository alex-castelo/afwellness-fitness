import { pathToFileURL } from "node:url";

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
    console.log(`generate: not yet implemented (content=${parsed.content}, out=${parsed.out})`);
    return;
  }

  console.log(`validate: not yet implemented (content=${parsed.content})`);
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
