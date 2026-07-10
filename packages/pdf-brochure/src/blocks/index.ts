import type { Block } from "../schema/content.schema.js";
import { renderTextBlock } from "./text.js";

type Renderer<T extends Block["type"]> = (data: Extract<Block, { type: T }>) => string;

const registry: Partial<{ [K in Block["type"]]: Renderer<K> }> = {
  text: renderTextBlock,
};

export function renderBlock(block: Block): string {
  const renderer = registry[block.type];

  if (!renderer) {
    throw new Error(`No block renderer registered for type "${block.type}"`);
  }

  return (renderer as Renderer<typeof block.type>)(block);
}
