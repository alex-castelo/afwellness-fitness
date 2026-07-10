# Implementation Plan: PDF Brochure Generator (pdf-brochure)

Source: `SPEC.md` (repo root).

## Overview

Build a pnpm-workspace monorepo whose first package, `packages/pdf-brochure`, is a
TypeScript CLI that renders a single-page-flow A4 PDF brochure from a JSON content
file. The non-negotiable constraint is that layout can never break: this is enforced
by a hard split between a fixed `template/` + `blocks/` catalog (code, not editable by
the AI) and a Zod-validated `content/brochure.json` (data, freely editable). The
pipeline is: read content → validate against schema → build HTML → render to PDF with
Puppeteer.

The riskiest unknown is the full pipeline glue (schema → block registry → template
assembly → Puppeteer → PDF), not any individual block's HTML. The plan front-loads
that risk: a minimal end-to-end PDF (cover + header + footer + one `text` block) ships
in Phase 2, before the other five block types exist. Everything after that is
additive and low-risk.

## Architecture Decisions

- **No extra CLI-parsing dependency.** `cli.ts` hand-parses two flags per command
  (`--content`, `--out`) since the surface is tiny. Avoids a Puppeteer-adjacent
  "ASK FIRST: changing dependencies" conversation for something `process.argv`
  handles in a few lines.
- **`tsx` to run the CLI directly** (no separate build/dist step) — this is a
  developer-run tool, not a deployed service, so compiling TS→JS ahead of time adds
  a step for no benefit. `typecheck` (`tsc --noEmit`) still gives full type safety.
- **Content contract beyond blocks**: the spec defines the *block* catalog precisely
  but not the document-level fields. Confirmed with the trainer — the doc-level
  metadata is: company name (`AFS Corporate Wellness`), address
  (`Av. Diagonal, 686 (08034 Barcelona) — Real Club de Polo Barcelona`), email
  (`afscorporatewellness@gmail.com`), phone (`+34 679 64 91 27`), website
  (`afscorporatewellness.com`), Instagram handle (`@alex.febre`), and an optional
  `logoUrl` (logo doesn't exist yet — schema must treat it as optional so `generate`/
  `validate` keep working without one; header/footer/cover fall back to text-only
  branding until a logo is supplied).
- **Schema defined fully, once, up front (Phase 2, Task 3)**, even though block
  *rendering* is built incrementally across Phases 2–3. The schema is the contract;
  splitting it across tasks would mean revisiting the same file repeatedly and risks
  drift between "what validate accepts" and "what blocks can render."
- **Tests live beside the task that introduces the code**, not as a separate
  end-of-plan task — matches SPEC §5 (`schema.test.ts`, `blocks.test.ts`) and keeps
  each task independently verifiable.

## Dependency Graph

```
Root workspace config (pnpm-workspace.yaml, tsconfig.base.json, biome.json)
    │
    └── packages/pdf-brochure package skeleton (package.json, tsconfig.json, cli.ts stub)
            │
            ├── schema/content.schema.ts  (Zod contract: doc metadata + 6 block types)
            │       │
            │       └── validate command (cli.ts → schema, no rendering needed)
            │
            ├── blocks/text.ts + blocks/index.ts (registry)
            │       │
            │       └── template/ (document.ts, cover.ts, header.ts, footer.ts, styles.css)
            │               │
            │               └── render.ts (content → validate → HTML → Puppeteer → PDF)
            │                       │
            │                       └── generate command (cli.ts → render.ts)
            │
            ├── remaining blocks (textImage, benefitsList, pricingTable, testimonial, gallery)
            │       — depend on schema (done) + registry (done), independent of each other
            │
            └── full sample content/brochure.json exercising every block type
                    — depends on all blocks existing
```

Implementation order follows this graph bottom-up, with the full pipeline
(schema → one block → template → render → CLI) proven end-to-end before the
remaining five blocks are added.

## Task List

### Phase 1: Foundation

- [x] **Task 1: Root workspace scaffold**
- [x] **Task 2: pdf-brochure package skeleton + CLI shell**

### Checkpoint 1: Foundation
- [ ] `pnpm install` succeeds at root
- [ ] `pnpm --filter pdf-brochure typecheck` and `lint` run clean (even with near-empty source)
- [ ] `pnpm --filter pdf-brochure generate` / `validate` print a "not implemented yet" or stub message without crashing
- [ ] Human review before proceeding (confirms tooling choices: tsx, biome, vitest versions)

### Phase 2: Core pipeline (highest risk — build and prove this first)

- [x] **Task 3: Content schema (Zod) — full catalog contract**
- [x] **Task 4: Minimal template + `text` block + render pipeline (first real PDF)**

### Checkpoint 2: Core pipeline proven end-to-end
- [ ] `pnpm --filter pdf-brochure validate` accepts a valid minimal content file and rejects an invalid one with a clear error
- [ ] `pnpm --filter pdf-brochure generate` produces `output/brochure.pdf` with cover + header + footer + one text block
- [ ] Developer opens the PDF and visually confirms A4 size, no broken layout, background colors present
- [ ] `pnpm --filter pdf-brochure test` passes (schema.test.ts + blocks.test.ts for `text`)
- [ ] **Human review required** — this checkpoint validates the spec's non-negotiable requirement ("layout must never break"). Do not proceed to Phase 3 until this is confirmed.

### Phase 3: Full block catalog

- [x] **Task 5: Blocks batch A — `textImage`, `benefitsList`**
- [x] **Task 6: Blocks batch B — `pricingTable`, `testimonial`, `gallery`**

### Checkpoint 3: All blocks implemented
- [ ] `pnpm --filter pdf-brochure test` passes for all 6 blocks
- [ ] `pnpm --filter pdf-brochure typecheck` and `lint` clean
- [ ] Human review before assembling full sample content

### Phase 4: Integration, visual pass, and polish

- [x] **Task 7: Full sample content + template visual pass**
- [x] **Task 8: Root convenience scripts + final QA pass**

### Checkpoint 4: Complete
- [x] `pnpm generate` and `pnpm validate` work from repo root (convenience aliases)
- [x] Full sample PDF exercising all 6 block types manually reviewed and looks correct
- [x] `pnpm --filter pdf-brochure test|typecheck|lint` all green
- [x] SPEC.md boundaries respected (no edits to `template/`/`blocks/` visual code outside this build, no undisclosed dependency changes)
- [x] Ready to hand off: developer can now iterate on real content via `content/brochure.json`

---

## Task Detail

## Task 1: Root workspace scaffold

**Description:** Set up the pnpm workspace itself: `pnpm-workspace.yaml`, root
`package.json` (private, `workspaces`/`packageManager` field, placeholder scripts),
`biome.json` (shared lint/format config), `tsconfig.base.json` (`strict: true` and
other shared compiler options). No package code yet — this is pure tooling
scaffolding so `packages/pdf-brochure` has something to extend.

**Acceptance criteria:**
- [ ] `pnpm-workspace.yaml` declares `packages/*`
- [ ] Root `package.json` has `"private": true`, a `packageManager` field pinning the
      pnpm version, and is otherwise dependency-free
- [ ] `tsconfig.base.json` sets `strict: true` plus sensible modern target/module
      settings (ESM, Node LTS target)
- [ ] `biome.json` configures lint + format with reasonable defaults (2-space indent
      or project convention, organize-imports on)

**Verification:**
- [ ] `pnpm install` runs without error (even with zero packages under `packages/`)
- [ ] Manual check: `cat pnpm-workspace.yaml tsconfig.base.json biome.json` look correct

**Dependencies:** None

**Files likely touched:**
- `pnpm-workspace.yaml`
- `package.json`
- `tsconfig.base.json`
- `biome.json`
- `.gitignore` (node_modules, output/, dist/) — repo was `git init`'d during plan
  finalization; this task adds the ignore file and makes the first commit

**Estimated scope:** XS (4-5 files, no logic)

---

## Task 2: pdf-brochure package skeleton + CLI shell

**Description:** Create `packages/pdf-brochure` with its own `package.json`
(extending the workspace), `tsconfig.json` (extends `tsconfig.base.json`), and a
`src/cli.ts` entry point that parses `generate` and `validate` subcommands plus
`--content`/`--out` flags (with defaults `./src/content/brochure.json` and
`./output/brochure.pdf`). At this stage the commands can no-op / print "not yet
implemented" — the goal is the command surface and package scripts, not behavior.
Wire root convenience scripts (`pnpm generate`, `pnpm validate`) to delegate via
`--filter pdf-brochure`.

**Acceptance criteria:**
- [ ] `pdf-brochure/package.json` declares scripts: `generate`, `validate`, `test`,
      `typecheck`, `lint`, `format`, each matching SPEC §2 command names exactly
- [ ] `cli.ts` parses `generate`/`validate` as subcommands and `--content`/`--out` as
      optional flags with the documented defaults
- [ ] Root `package.json` gains `generate`/`validate` scripts that delegate to
      `pnpm --filter pdf-brochure <script>`
- [ ] Dev dependencies added: `typescript`, `tsx`, `vitest`, `@biomejs/biome`, `zod`,
      `puppeteer` (zod/puppeteer used starting Task 3/4, but pinned now)

**Verification:**
- [ ] `pnpm --filter pdf-brochure generate` and `... validate` run without crashing
      (stub output acceptable)
- [ ] `pnpm generate` / `pnpm validate` from repo root resolve to the same commands
- [ ] `pnpm --filter pdf-brochure typecheck` passes (empty/stub code, but strict mode
      clean)
- [ ] `pnpm --filter pdf-brochure lint` passes

**Dependencies:** Task 1

**Files likely touched:**
- `packages/pdf-brochure/package.json`
- `packages/pdf-brochure/tsconfig.json`
- `packages/pdf-brochure/src/cli.ts`
- root `package.json` (scripts section)

**Estimated scope:** S (3-4 files)

---

## Task 3: Content schema (Zod) — full catalog contract

**Description:** Write `src/schema/content.schema.ts` defining the complete content
contract: document-level metadata plus a discriminated union over all six block
types (`text`, `textImage`, `pricingTable`, `gallery`, `testimonial`,
`benefitsList`), each with its required/optional fields per SPEC §3. Export a typed
`validateContent` function returning either parsed content or a structured,
readable error (which block index, which field, what's wrong). Wire the `validate`
CLI command to call it and print pass/fail.

Document-level metadata fields (confirmed with the trainer):
- `companyName` (string, required) — `"AFS Corporate Wellness"`
- `address` (string, required) — `"Av. Diagonal, 686 (08034 Barcelona) — Real Club de Polo Barcelona"`
- `email` (string, required)
- `phone` (string, required)
- `website` (string, required)
- `instagram` (string, required) — handle, e.g. `"@alex.febre"`
- `logoUrl` (string, **optional**) — logo doesn't exist yet; cover/header/footer must
  render sensibly without it (text-only branding fallback)

Gallery block bounds (confirmed): `images` array, min **1**, max **6** items — the
fixed grid in `blocks/gallery.ts` must handle anywhere from a single large image up
to six without breaking.

**Acceptance criteria:**
- [ ] Schema covers document metadata (fields above, `logoUrl` optional, everything
      else required) + a `blocks: Block[]` array
- [ ] Discriminated union rejects an unknown `type` value with a clear error
      identifying it's an unrecognized block type
- [ ] Each block's required fields are enforced (missing required field → rejected
      with field name in the error)
- [ ] `gallery` block's `images` field enforces min 1 / max 6 items
- [ ] `validate` command exits non-zero with a human-readable message on invalid
      content, exits 0 with a success message on valid content
- [ ] `schema.test.ts` covers: one fully-valid fixture (accepted), one fixture with an
      unknown block type (rejected + identifiable error), one fixture with a missing
      required field (rejected + identifiable error), one fixture with a gallery
      block over/under the image bounds (rejected)

**Verification:**
- [ ] `pnpm --filter pdf-brochure test` passes `schema.test.ts`
- [ ] `pnpm --filter pdf-brochure validate` against a hand-written valid fixture exits
      0; against a hand-written invalid fixture exits non-zero with a readable message
- [ ] `pnpm --filter pdf-brochure typecheck` clean

**Dependencies:** Task 2

**Files likely touched:**
- `packages/pdf-brochure/src/schema/content.schema.ts`
- `packages/pdf-brochure/src/cli.ts` (wire `validate`)
- `packages/pdf-brochure/test/schema.test.ts`
- `packages/pdf-brochure/test/fixtures/*.json` (valid/invalid fixtures)

**Estimated scope:** M (3-4 files, but the schema file itself is the core design work)

---

## Task 4: Minimal template + `text` block + render pipeline (first real PDF)

**Description:** This is the task that proves the whole architecture. Build the
minimal fixed template — `template/document.ts` (assembles cover + header + blocks +
footer into a full HTML document), `template/cover.ts`, `template/header.ts`,
`template/footer.ts`, `template/styles.css` (a first pass at visual identity — colors/
typography placeholders, refined later in Task 7) — plus `blocks/text.ts` (the
simplest block: a pure `(data) => string` function) and `blocks/index.ts` (registry
mapping block `type` → render function, currently with one entry). Write
`render.ts`: read content file → `validateContent` (Task 3) → assemble full HTML via
`template/document.ts` → launch Puppeteer → `page.pdf()` at A4 with
`printBackground: true` → write to `--out` path. Wire the `generate` CLI command to
call it.

**Acceptance criteria:**
- [ ] `render.ts` fails loudly (no PDF written) if content doesn't pass the schema —
      reuses Task 3's `validateContent`, never generates from unvalidated content
- [ ] `blocks/index.ts` throws a clear error if content references a block `type` not
      in the registry (defense in depth — schema should already have caught this, but
      the registry lookup itself must not silently no-op)
- [ ] A minimal content fixture (doc metadata + one `text` block) renders to a real
      PDF file at the `--out` path
- [ ] PDF is A4, `printBackground: true`, and visually shows cover, header, the text
      block's content, and footer with no obviously broken layout
- [ ] `blocks.test.ts` asserts the `text` block's HTML output contains the expected
      text content and expected structural wrapper (e.g. a specific class/tag)

**Verification:**
- [ ] `pnpm --filter pdf-brochure generate` produces `output/brochure.pdf` from the
      default/sample content path
- [ ] `pnpm --filter pdf-brochure test` passes (schema + blocks tests)
- [ ] Manual check: open the generated PDF, confirm cover/header/footer/text block
      render without layout breakage, at A4 size
- [ ] `pnpm --filter pdf-brochure typecheck` and `lint` clean

**Dependencies:** Task 3

**Files likely touched:**
- `packages/pdf-brochure/src/template/document.ts`
- `packages/pdf-brochure/src/template/cover.ts`
- `packages/pdf-brochure/src/template/header.ts`
- `packages/pdf-brochure/src/template/footer.ts`
- `packages/pdf-brochure/src/template/styles.css`
- `packages/pdf-brochure/src/blocks/text.ts`
- `packages/pdf-brochure/src/blocks/index.ts`
- `packages/pdf-brochure/src/render.ts`
- `packages/pdf-brochure/src/cli.ts` (wire `generate`)
- `packages/pdf-brochure/src/content/brochure.json` (minimal sample)
- `packages/pdf-brochure/test/blocks.test.ts`

**Estimated scope:** L by file count (9 files) but each file is small/mechanical
except `render.ts` and `document.ts` — flagged here rather than split further because
splitting the pipeline across tasks would mean no working PDF exists until both
halves land, defeating the point of proving it end-to-end early. If this feels too
big once started, the natural cut line is: template files (cover/header/footer/
styles/document) as one pass, then `blocks/text.ts` + `render.ts` + CLI wiring as a
second pass, same checkpoint.

---

## Task 5: Blocks batch A — `textImage`, `benefitsList`

**Description:** Implement the next two block render functions and register them.
Both are structurally simple (single image + text; a list of strings/short items),
making them a good low-risk second wave after the pipeline is proven.

**Acceptance criteria:**
- [ ] `blocks/text-image.ts` renders image + text per its schema fields (image path/
      alt text, heading, body)
- [ ] `blocks/benefits-list.ts` renders a list of benefit items
- [ ] Both registered in `blocks/index.ts`
- [ ] `blocks.test.ts` gains targeted assertions for each (expected text/structure
      present, not full-HTML snapshots)

**Verification:**
- [ ] `pnpm --filter pdf-brochure test` passes including the two new block tests
- [ ] A content fixture using both blocks generates a PDF without error (manual spot
      check, doesn't need to be the final sample)
- [ ] `typecheck`/`lint` clean

**Dependencies:** Task 4

**Files likely touched:**
- `packages/pdf-brochure/src/blocks/text-image.ts`
- `packages/pdf-brochure/src/blocks/benefits-list.ts`
- `packages/pdf-brochure/src/blocks/index.ts`
- `packages/pdf-brochure/test/blocks.test.ts`

**Estimated scope:** S (4 files)

---

## Task 6: Blocks batch B — `pricingTable`, `testimonial`, `gallery`

**Description:** Implement the remaining three block render functions. These are
the more structurally complex ones (tabular/array data for pricing tiers, multi-image
layout for gallery), so they follow the simpler blocks once the pattern is well
established.

**Acceptance criteria:**
- [ ] `blocks/pricing-table.ts` renders pricing tiers/rows per schema fields (plan
      name, price, features list, etc.)
- [ ] `blocks/testimonial.ts` renders quote + attribution
- [ ] `blocks/gallery.ts` renders a set of images (handles 1..N images gracefully —
      confirm expected N range with schema constraints from Task 3)
- [ ] All three registered in `blocks/index.ts`
- [ ] `blocks.test.ts` gains targeted assertions for each

**Verification:**
- [ ] `pnpm --filter pdf-brochure test` passes — all 6 blocks now covered
- [ ] `typecheck`/`lint` clean

**Dependencies:** Task 4 (does not depend on Task 5 — can run in parallel with it if
splitting across two sessions/agents)

**Files likely touched:**
- `packages/pdf-brochure/src/blocks/pricing-table.ts`
- `packages/pdf-brochure/src/blocks/testimonial.ts`
- `packages/pdf-brochure/src/blocks/gallery.ts`
- `packages/pdf-brochure/src/blocks/index.ts`
- `packages/pdf-brochure/test/blocks.test.ts`

**Estimated scope:** M (5 files)

---

## Task 7: Full sample content + template visual pass

**Description:** Now that all 6 blocks exist, write a full `content/brochure.json`
sample that exercises every block type in a plausible order (this becomes the
reference/demo content, replaced later with the trainer's real content). Use this
as the vehicle to do a real visual pass on `template/styles.css`, `cover.ts`,
`header.ts`, `footer.ts` — this is the explicit "branding task" the SPEC's boundary
rules call out, so treat visual/color/typography decisions here as needing sign-off,
not silent choices.

**Acceptance criteria:**
- [ ] `content/brochure.json` includes at least one of every block type
- [ ] `pnpm --filter pdf-brochure validate` passes on it
- [ ] `pnpm --filter pdf-brochure generate` produces a full PDF with no layout
      breakage across all 6 block types back-to-back
- [ ] Visual identity (colors/typography/spacing in `styles.css`, cover/header/footer
      layout) reviewed and approved by the developer/trainer before considered final

**Verification:**
- [ ] Manual visual review of the generated PDF (per SPEC §5, this is intentionally
      manual, not automated)
- [ ] `pnpm --filter pdf-brochure test|typecheck|lint` all clean

**Dependencies:** Tasks 5, 6

**Files likely touched:**
- `packages/pdf-brochure/src/content/brochure.json`
- `packages/pdf-brochure/src/template/styles.css`
- `packages/pdf-brochure/src/template/cover.ts` / `header.ts` / `footer.ts` (visual
  refinement only, not structural changes)

**Estimated scope:** M (visual iteration, file count small but may take a few passes)

---

## Task 8: Root convenience scripts + final QA pass

**Description:** Confirm the root-level `pnpm generate` / `pnpm validate` aliases
(added in Task 2) still resolve correctly now that the package is fully built, and
do a final full-repo QA pass: install from clean, typecheck, lint, test, generate,
all green.

**Acceptance criteria:**
- [ ] `pnpm install` from a clean checkout succeeds
- [ ] `pnpm generate` and `pnpm validate` work from repo root, no `--filter` needed
- [ ] `pnpm --filter pdf-brochure test|typecheck|lint` all pass with zero errors/
      warnings
- [ ] `.gitignore` correctly excludes `output/`, `node_modules/`

**Verification:**
- [ ] Full command sweep from SPEC §2 run in sequence, all succeed
- [ ] Manual check: generated PDF opens correctly in a PDF viewer

**Dependencies:** Task 7

**Files likely touched:**
- root `package.json` (verify only, edit if drift found)
- `.gitignore` (verify only)

**Estimated scope:** XS (verification-heavy, minimal new code)

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Puppeteer's bundled Chromium download fails/is slow in this environment (network/sandbox restrictions) | High — blocks Task 4 and everything after | Try the install early (end of Task 2) rather than discovering it mid-Task-4; if it fails, fall back to `puppeteer-core` + system Chrome as an explicit, confirmed dependency change |
| No logo exists yet but `logoUrl` is part of the schema | Low | Field is optional; cover/header/footer render a text-only fallback until the trainer provides one |
| Visual/branding work in Task 7 is explicitly gated behind confirmation per SPEC boundaries | Low if respected, high if skipped | Task 7 acceptance criteria explicitly require sign-off before considering styles final |

## Open Questions

All resolved as of plan finalization:
- ~~Document-level metadata fields~~ — confirmed (see Task 3): company name,
  address, email, phone, website, Instagram handle; logo optional/pending.
- ~~Initialize git?~~ — done (`git init` run at plan finalization; no commits made yet
  — first commit is a build-phase action, not done automatically per this session's
  git rules).
- ~~Gallery image count bounds~~ — confirmed: min 1, max 6.
- ~~Fonts for `assets/fonts/`~~ — confirmed: placeholder/system fonts for now
  (`styles.css` first pass in Task 4), real typefaces added during Task 7's branding
  pass if the trainer wants custom fonts at that point.
