# SEO Phase 2 Long-Tail Growth Implementation Plan

Chinese version: [2026-08-13-seo-phase2-long-tail-growth.zh-CN.md](./2026-08-13-seo-phase2-long-tail-growth.zh-CN.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 20 long-tail JSON error guides, an external discovery checklist, and a Google Search Console monitoring table so JSONFmt can grow beyond broad competitive formatter keywords.

**Architecture:** Keep the existing static-page generator as the crawlable content source. Add a focused Phase 2 guide data module, push those guides into `GUIDE_PAGES`, group them under runtime and serialization errors, and keep documentation bilingual through the documentation parity test.

**Tech Stack:** Node ESM, Vite static generation, Vitest, Markdown documentation.

---

## File Structure

- `scripts/phase2-guides.mjs`: Owns Phase 2 guide slugs and guide content.
- `scripts/generate-static-pages.mjs`: Imports Phase 2 guide data and adds the runtime guide group.
- `scripts/generate-static-pages.test.mjs`: Verifies route count, guide count, Phase 2 slugs, sitemap inclusion, keyword map coverage, and operations documents.
- `docs/seo-keyword-map.md`: Adds Phase 2 primary keyword mapping.
- `docs/seo-keyword-map.zh-CN.md`: Chinese version of the keyword map update.
- `docs/seo-external-submission-checklist.md`: External discovery checklist.
- `docs/seo-external-submission-checklist.zh-CN.md`: Chinese version of the external checklist.
- `docs/gsc-monitoring-table.md`: Weekly Search Console monitoring template.
- `docs/gsc-monitoring-table.zh-CN.md`: Chinese version of the monitoring template.

### Task 1: Phase 2 Static Tests

- [x] **Step 1: Add failing static generator tests**

Assert that `PAGE_ROUTES` reaches at least 53 routes, `GUIDE_PAGES` reaches 38 guides, all 20 Phase 2 slugs exist, the guide index has a `Runtime and serialization errors` group, the keyword map includes every new guide, and the new operations documents exist.

- [x] **Step 2: Verify RED**

Run: `npm test -- scripts/generate-static-pages.test.mjs`

Expected: fail because `scripts/phase2-guides.mjs` does not exist yet.

### Task 2: Phase 2 Long-Tail Guides

- [x] **Step 1: Create Phase 2 guide data**

Add 20 long-tail guide pages covering `JSON.parse`, fetch, response body, special number, escape, BOM, duplicate key, truncated response, and content-type errors.

- [x] **Step 2: Register guides in static generation**

Import `createPhase2Guides` into `scripts/generate-static-pages.mjs`, push the returned pages into `GUIDE_PAGES`, and add the runtime guide group.

- [x] **Step 3: Verify guide quality**

Run: `npm test -- scripts/generate-static-pages.test.mjs`

Expected: all Phase 2 guides are present, have 5 sections, 4 FAQ items, and remain inside the 800-1200 word target range.

### Task 3: SEO Operations Documents

- [x] **Step 1: Add external discovery checklist**

Create `docs/seo-external-submission-checklist.md` and `.zh-CN.md` with owned profile, developer community, tool directory, and Search Console follow-up actions.

- [x] **Step 2: Add GSC monitoring table**

Create `docs/gsc-monitoring-table.md` and `.zh-CN.md` with weekly URL, keyword, indexing, impressions, clicks, CTR, position, and action fields.

- [x] **Step 3: Update keyword map**

Add the Phase 2 guide cluster to both English and Chinese keyword maps.

### Task 4: Full Verification

- [ ] **Step 1: Run targeted static tests**

Run: `npm test -- scripts/generate-static-pages.test.mjs`

Expected: pass.

- [ ] **Step 2: Run full tests**

Run: `npm test`

Expected: pass.

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: pass.

- [ ] **Step 4: Run production build**

Run: `npm run build`

Expected: build succeeds and `dist/sitemap.xml` contains 53 public routes.
