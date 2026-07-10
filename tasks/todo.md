# Todo: PDF Brochure Generator (pdf-brochure)

Full detail, acceptance criteria, and verification steps: `tasks/plan.md`.

## Phase 1: Foundation
- [x] Task 1: Root workspace scaffold (`pnpm-workspace.yaml`, root `package.json`, `tsconfig.base.json`, `biome.json`)
- [x] Task 2: pdf-brochure package skeleton + CLI shell (`package.json`, `tsconfig.json`, `cli.ts` stub, root convenience scripts)

**Checkpoint 1** — `pnpm install` clean; typecheck/lint clean; CLI stubs run without crashing. Human review. ✅ done

## Phase 2: Core pipeline (highest risk — build first)
- [x] Task 3: Content schema (Zod) — full catalog contract + `validate` command
- [x] Task 4: Minimal template + `text` block + render pipeline — **first real PDF**

**Checkpoint 2 — critical** — `generate` produces a real PDF (cover+header+footer+text), `validate` accepts/rejects correctly, tests pass, PDF opened and visually confirmed. **Human review required before continuing.** ✅ confirmed by developer

## Phase 3: Full block catalog
- [x] Task 5: Blocks batch A — `textImage`, `benefitsList`
- [ ] Task 6: Blocks batch B — `pricingTable`, `testimonial`, `gallery` (can run in parallel with Task 5)

**Checkpoint 3** — all 6 blocks tested, typecheck/lint clean. Human review.

## Phase 4: Integration, visual pass, polish
- [ ] Task 7: Full sample content (all 6 block types) + template visual/branding pass (needs sign-off)
- [ ] Task 8: Root convenience scripts verified + final full-repo QA sweep

**Checkpoint 4 — complete** — `pnpm generate`/`pnpm validate` work from root, full test/typecheck/lint sweep green, sample PDF visually approved, SPEC boundaries respected.

## Resolved decisions (previously open questions — see plan.md)
- [x] Document-level metadata: company name, address, email, phone, website, Instagram; logo optional (pending)
- [x] Git repo initialized (`git init` done; first commit happens in Task 1)
- [x] `gallery` block bounds: min 1, max 6 images
- [x] Fonts: placeholder/system fonts now, real typefaces during Task 7's branding pass
