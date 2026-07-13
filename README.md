# afwellness-fitness

Freelance tooling monorepo built for a personal trainer's business. It currently hosts one project — a PDF brochure generator used for B2B sales — with room to add related tools (e.g. a landing page) later.

## Packages

| Package | Description |
| --- | --- |
| [`packages/pdf-brochure`](./packages/pdf-brochure) | TypeScript CLI that generates a single-page sales brochure (cover + content blocks + footer) as a PDF. |

## Requirements

- Node.js >= 20
- [pnpm](https://pnpm.io/) 11.x

## Getting started

```bash
pnpm install
```

## Commands

Root-level convenience scripts (delegate to `pdf-brochure`):

```bash
pnpm generate    # generate the brochure PDF from current content
pnpm validate    # validate content against the schema, no PDF produced
```

Package-scoped commands:

```bash
pnpm --filter pdf-brochure generate
pnpm --filter pdf-brochure generate -- --content ./src/content/brochure.json --out ./output/brochure.pdf
pnpm --filter pdf-brochure validate
pnpm --filter pdf-brochure test         # run the test suite (Vitest)
pnpm --filter pdf-brochure typecheck    # tsc --noEmit
pnpm --filter pdf-brochure lint         # biome check
pnpm --filter pdf-brochure format       # biome format --write
```

## How the brochure generator works

The core design rule is a strict separation between **template** and **content**, so the layout can never break regardless of what content is passed in:

- **Template** (`src/template/`, `src/blocks/`) — fixed HTML/CSS + TypeScript defining the cover, header, footer, and a closed catalog of reusable content blocks (text, text+image, pricing table, gallery, testimonial, benefits list).
- **Content** (`src/content/brochure.json`) — the only file meant to be edited freely. It picks which blocks to use, in what order, and what goes inside each one.
- **Schema** (`src/schema/content.schema.ts`) — a Zod contract between the two. If content doesn't match the schema (unknown block type, missing field, etc.), `validate`/`generate` fail with a clear error instead of producing a broken PDF.

Rendering pipeline: content is validated → assembled into HTML via the template and blocks → rendered to PDF (A4, `printBackground: true`) with Puppeteer.

See [`SPEC.md`](./SPEC.md) for the full design spec, project structure, and editing boundaries.

## Project structure

```
afwellness-fitness/
├── pnpm-workspace.yaml
├── package.json              # root scripts: generate, validate
├── biome.json                 # shared lint/format config
├── tsconfig.base.json         # shared, strict TypeScript config
├── SPEC.md                    # full design spec
└── packages/
    └── pdf-brochure/          # the brochure generator
        ├── src/
        │   ├── cli.ts          # entry point (generate / validate)
        │   ├── render.ts       # orchestrates validation → HTML → PDF
        │   ├── schema/         # Zod content schema
        │   ├── content/        # editable brochure content (JSON)
        │   ├── template/       # fixed cover/header/footer/styles
        │   └── blocks/         # fixed catalog of content blocks
        ├── assets/             # images and fonts
        ├── output/             # generated PDFs (gitignored)
        └── test/               # Vitest unit tests
```

## Code style

- [Biome](https://biomejs.dev/) for linting and formatting (no ESLint/Prettier).
- TypeScript with `strict: true`.
- Blocks are pure functions `(data) => string` (HTML) rather than stateful components.
- Code identifiers are in English; brochure content is authored in Spanish, the trainer's business language.
