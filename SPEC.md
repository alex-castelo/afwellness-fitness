# SPEC — PDF Brochure Generator (afwellness-fitness tooling)

## Context

Freelance tooling project for a personal trainer (the developer's friend). This directory is a monorepo that will host several related projects; the first and highest-priority one is a **PDF brochure generator** for B2B sales. Later on (no fixed date, out of scope for this spec) a landing page (Astro or Next.js) will be added, from which these PDFs can be downloaded.

The developer is a full-stack TypeScript engineer and will be the one operating the tool (the trainer never runs it directly): he receives content/requests from the trainer, polishes it with Claude, and generates the PDF by running the generator.

## 1. Objective

Build a TypeScript CLI tool that generates a **single PDF brochure** (cover + internal content + footer) that the trainer can use to sell his plans and services to companies.

Non-negotiable requirement: **the layout must never break**, regardless of what content is passed in. This is achieved by strictly separating:

- **Template** (cover, header, footer, and the design of each content block type): fixed code in HTML/CSS + TypeScript, outside the AI's editing scope.
- **Content** (text, prices, images, and which blocks to use in what order): a data file that the AI can freely edit, validated against a schema before rendering.

If the content doesn't satisfy the schema, the generator fails with a clear error — it never produces a PDF with broken layout.

Success = the trainer has a professional, consistent-looking brochure that's easy to update (prices, services, text) without redesigning anything, with real room for internal variation (different combinations of blocks: text, text+image, pricing table, gallery, testimonials, benefits list).

Out of scope for this spec: the landing page, and support for PDF types other than the brochure (considered a future extension, but this spec's design shouldn't require a full redesign to accommodate it later — see "Future extensibility" in Project Structure).

## 2. Commands

Package manager: **pnpm** (workspaces). Node LTS.

From the monorepo root:

```bash
pnpm install                              # installs dependencies for all packages

pnpm --filter pdf-brochure generate       # generates the PDF brochure from the current content
pnpm --filter pdf-brochure generate -- --content ./src/content/brochure.json --out ./output/brochure.pdf
                                           # (paths configurable; sensible defaults if omitted)

pnpm --filter pdf-brochure validate       # validates content against the schema only, no PDF generated
pnpm --filter pdf-brochure test           # runs the test suite (Vitest)
pnpm --filter pdf-brochure typecheck      # tsc --noEmit
pnpm --filter pdf-brochure lint           # biome check
pnpm --filter pdf-brochure format         # biome format --write
```

Convenience aliases in the root `package.json` (delegate to the `pdf-brochure` package):

```bash
pnpm generate    # = pnpm --filter pdf-brochure generate
pnpm validate    # = pnpm --filter pdf-brochure validate
```

## 3. Project structure

```
afwellness-fitness/                    (monorepo root, pnpm workspace)
├── pnpm-workspace.yaml
├── package.json                       (root scripts: generate, validate, etc.)
├── biome.json                         (shared lint/format config)
├── tsconfig.base.json                 (shared, strict: true)
├── SPEC.md
├── .claude/ .agents/                  (already existing, untouched)
│
└── packages/
    └── pdf-brochure/                  (the generator — only active project for now)
        ├── package.json
        ├── tsconfig.json              (extends tsconfig.base.json)
        ├── src/
        │   ├── cli.ts                 # entry point: parses commands (generate / validate)
        │   ├── render.ts              # orchestrates: reads content → validates → builds HTML → Puppeteer → PDF
        │   │
        │   ├── schema/
        │   │   └── content.schema.ts  # Zod: defines valid blocks and their fields
        │   │
        │   ├── content/
        │   │   └── brochure.json      # ← the ONLY file Claude edits freely
        │   │
        │   ├── template/              # FIXED — outside the AI's editing scope
        │   │   ├── document.ts        # assembles cover + header + footer + blocks
        │   │   ├── cover.ts
        │   │   ├── header.ts
        │   │   ├── footer.ts
        │   │   └── styles.css         # visual identity: colors, typography, spacing
        │   │
        │   └── blocks/                # FIXED — closed catalog of reusable pieces
        │       ├── index.ts           # registry: block type → render function
        │       ├── text.ts
        │       ├── text-image.ts
        │       ├── pricing-table.ts
        │       ├── gallery.ts
        │       ├── testimonial.ts
        │       └── benefits-list.ts
        │
        ├── assets/
        │   ├── images/                # photos referenced by content
        │   └── fonts/                 # custom typefaces, if any
        │
        ├── output/                    # generated PDFs (gitignored)
        │
        └── test/
            ├── schema.test.ts         # valid/invalid content → validate accepts/rejects
            └── blocks.test.ts         # each block, given an input, renders the expected HTML
```

**Key design rule:** `template/` and `blocks/` are the "closed catalog" — everything that can be visually displayed lives there as code, with its own fixed design. `content/brochure.json` is the only editable surface: it picks which blocks to use, in what order, and what goes inside each one. `schema/content.schema.ts` is the contract between the two — if content doesn't match the schema (e.g. a block type that doesn't exist, or a missing field), `validate`/`generate` fail with a clear message instead of producing a broken PDF.

**Future extensibility (not implemented now):** when support for another PDF type is needed, the pattern repeats — a new `packages/pdf-<type>/` package with its own `template/` folder and its own `blocks/` catalog (reusing common blocks where applicable). No generic "multi-document" abstraction is needed now; it gets designed once a second real case shows up.

## 4. Code style

- **Biome** for lint + format (a single tool, no ESLint/Prettier).
- TypeScript with `strict: true` in `tsconfig.base.json`.
- No classes where a function suffices — blocks are pure functions `(data) => string` (HTML), not stateful components.
- Block names and schema fields: English identifiers in code (`type: "pricingTable"`), matching the rest of the codebase. Human-facing content (the actual brochure text) is in Spanish, since that's the trainer's business language — that's just data, not code.
- No comments explaining what the code does; only comments where the *why* isn't obvious (e.g. a specific print-CSS margin, or a Puppeteer workaround).

## 5. Testing strategy

Scope: **basic unit tests**, no visual PDF snapshots and no end-to-end rendering tests.

- `schema.test.ts`: valid and invalid content fixtures → confirm `content.schema.ts` accepts the valid one and rejects the invalid one with an identifiable error (unknown block type, missing required field, etc.).
- `blocks.test.ts`: for each block function (`text`, `textImage`, `pricingTable`, `gallery`, `testimonial`, `benefitsList`), given a sample input, check that the resulting HTML contains the expected structure/data (no full snapshot — targeted assertions on key content and structure).
- The actual PDF binary output (Puppeteer) is not automatically tested; verifying the final PDF looks right is manual/visual, done by the developer each time before sending it.

Runner: **Vitest**.

## 6. Boundaries

**ALWAYS (no need to ask):**
- Edit `src/content/brochure.json`: add/update text, prices, services.
- Choose and reorder combinations of blocks already in the catalog (`blocks/index.ts`) to compose the brochure.
- Run `validate` and `generate`.

**ASK FIRST:**
- Creating a new block type (new file in `blocks/`, new schema entry).
- Changing the content schema (`content.schema.ts`) in ways that affect already-written content.
- Changing project dependencies (Puppeteer, Vitest, etc.) or their versions.

**NEVER (requires explicit user confirmation, not just asking in the normal flow):**
- Modifying the HTML/CSS in `template/` (cover, header, footer) or in existing `blocks/` — this is the trainer's fixed visual identity.
- Modifying `styles.css` (colors, typography, spacing) outside of an explicit branding task.

---

## Default technical decisions (to confirm, not blocking)

- **Puppeteer** (not Playwright) for HTML→PDF rendering: lighter weight for a single-purpose use case (printing one page to PDF), no need for the three browsers Playwright installs by default. Reconsider if cross-browser testing becomes a need later.
- PDF generated at A4 size, with `printBackground: true` so block background colors print correctly.
