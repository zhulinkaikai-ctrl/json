# V2 AdSense SEO Upgrade Implementation Plan

Chinese version: [2026-08-07-v2-adsense-seo.zh-CN.md](./2026-08-07-v2-adsense-seo.zh-CN.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add static SEO and trust pages around the existing JSON tool without changing the V1 tool workflow.

**Architecture:** Keep the React app as the homepage tool. Add a Node-based static page generator that runs after `vite build` and writes crawlable HTML pages, `sitemap.xml`, and `robots.txt` into `dist`.

**Tech Stack:** Vite, React, TypeScript, Vitest, ESLint, Node ESM.

---

### Task 1: Baseline and Documentation

**Files:**
- Create: `docs/product-requirements-v2.md`
- Create: `docs/superpowers/plans/2026-08-07-v2-adsense-seo.md`

- [ ] **Step 1: Run baseline tests**

Run: `npm test`
Expected: existing JSON diagnostics tests pass.

- [ ] **Step 2: Run baseline build**

Run: `npm run build`
Expected: Vite production build succeeds.

- [ ] **Step 3: Save V2 PRD and implementation plan**

Record the confirmed V2 scope, route list, SEO requirements, non-goals, and verification commands.

### Task 2: Static Site Generator Tests

**Files:**
- Create: `scripts/generate-static-pages.test.mjs`
- Create: `scripts/generate-static-pages.mjs`

- [ ] **Step 1: Write failing tests**

Cover route count, canonical URLs, sitemap URLs, robots directives, Article schema, FAQ schema, and no live ad scripts.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- scripts/generate-static-pages.test.mjs`
Expected: FAIL because `generate-static-pages.mjs` is not implemented yet.

### Task 3: Static Page Data and Rendering

**Files:**
- Create: `scripts/generate-static-pages.mjs`
- Modify: `package.json`

- [ ] **Step 1: Implement page metadata and content**

Add one guides index page, six guide pages, four trust pages, and rendering helpers.

- [ ] **Step 2: Add post-build generation**

Change the build script to run `node scripts/generate-static-pages.mjs` after `vite build`.

- [ ] **Step 3: Run generator tests**

Run: `npm test -- scripts/generate-static-pages.test.mjs`
Expected: PASS.

### Task 4: Homepage Navigation and Shared Styles

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `index.html`

- [ ] **Step 1: Add top navigation and footer**

Add `Tool`, `Guides`, `About`, `Contact`, `Privacy Policy`, and `Terms of Use` links.

- [ ] **Step 2: Add homepage Guides entry section**

Link to the six guide pages without moving the tool from the homepage.

- [ ] **Step 3: Add SEO metadata to homepage**

Add canonical and Open Graph tags for `https://jsonfmt.org/`.

### Task 5: Verification

**Files:**
- All changed project files.

- [ ] **Step 1: Run tests**

Run: `npm test`
Expected: all Vitest tests pass.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no ESLint errors.

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: production build succeeds and generated static pages exist in `dist`.

- [ ] **Step 4: Inspect generated files**

Check that `dist/sitemap.xml`, `dist/robots.txt`, `dist/guides/index.html`, article pages, and trust pages exist and contain `https://jsonfmt.org/` canonical links.
