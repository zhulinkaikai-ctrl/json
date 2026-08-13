# V3 Traffic Entry Phase 1 Implementation Plan

Chinese version: [2026-08-09-v3-traffic-entry-phase1.zh-CN.md](./2026-08-09-v3-traffic-entry-phase1.zh-CN.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the V3 Phase 1 crawlable tool-entry network around the existing browser-local JSON editor.

**Architecture:** Keep the React homepage as the main interactive tool. Extend the existing Node static generator so it emits indexable tool pages, a `/tools/` hub, richer guide links, sitemap entries, and schema. Update the homepage navigation and entry sections to point users and crawlers into the new tool network.

**Tech Stack:** Vite, React, TypeScript, Node ESM, Vitest, ESLint.

---

## File Structure

- `scripts/generate-static-pages.test.mjs`: Update existing V2 static-page assertions into V3 route, tool-page, sitemap, and schema assertions.
- `scripts/generate-static-pages.mjs`: Add tool page data, route registry, `/tools/` rendering, related-link modules, and SoftwareApplication/Breadcrumb schema.
- `src/App.tsx`: Update homepage positioning, navigation, mode/task entry links, guide links, FAQ, and footer matrix.
- `src/styles.css`: Add styles for tool entry grids, footer matrix, and static tool/hub pages while preserving the existing dark developer-tool aesthetic.
- `index.html`: Update homepage title, descriptions, Open Graph metadata, and FAQ JSON-LD for V3 broad formatter/validator positioning.

### Task 1: Static Generator TDD

**Files:**
- Modify: `scripts/generate-static-pages.test.mjs`
- Modify: `scripts/generate-static-pages.mjs`

- [ ] **Step 1: Write failing static generator tests**

Add tests that assert:

```js
expect(PAGE_ROUTES.length).toBeGreaterThanOrEqual(25)
expect(TOOL_PAGES.map((page) => page.path)).toEqual(expect.arrayContaining([
  '/json-formatter/',
  '/json-validator/',
  '/json-minifier/',
  '/json-beautifier/',
  '/json-pretty-print/',
  '/json-error-finder/',
  '/fix-invalid-json/',
  '/json-viewer/',
]))
expect(TOOLS_INDEX.path).toBe('/tools/')
```

Add render assertions:

```js
const html = renderStaticPage(TOOL_PAGES[0])
expect(html).toContain('"@type":"SoftwareApplication"')
expect(html).toContain('"@type":"BreadcrumbList"')
expect(html).toContain('Related JSON tools')
expect(html).toContain('Related guides')
```

- [ ] **Step 2: Run the targeted test and verify RED**

Run: `npm test -- scripts/generate-static-pages.test.mjs`

Expected: FAIL because `TOOL_PAGES` and `TOOLS_INDEX` are not exported yet and V3 routes are missing.

- [ ] **Step 3: Implement static page data and rendering**

Add exported `TOOL_PAGES`, `TOOLS_INDEX`, and additional guide pages. Extend `PAGE_ROUTES` to include home, tools index, tool pages, guide pages, and trust pages. Render tool pages with a static demo shell, FAQ, related tools, related guides, Breadcrumb JSON-LD, and SoftwareApplication JSON-LD.

- [ ] **Step 4: Run targeted static generator tests and verify GREEN**

Run: `npm test -- scripts/generate-static-pages.test.mjs`

Expected: PASS.

### Task 2: Homepage Entry Network

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `index.html`

- [ ] **Step 1: Write homepage expectations through static/build tests**

Extend existing static tests to assert V3 homepage metadata through `HOME_PAGE`:

```js
expect(HOME_PAGE.title).toContain('JSON Formatter')
expect(HOME_PAGE.description).toContain('Validate')
```

- [ ] **Step 2: Verify RED if metadata has not been updated**

Run: `npm test -- scripts/generate-static-pages.test.mjs`

Expected: FAIL until `HOME_PAGE` metadata matches V3 positioning.

- [ ] **Step 3: Update homepage UI and metadata**

Update the homepage H1 to `JSON formatter, validator, and error finder`. Add top navigation links for Formatter, Validator, Minifier, Error Finder, Guides, and Tools. Add a task entry grid for core tool pages and expand the footer matrix.

- [ ] **Step 4: Run targeted tests and lint**

Run: `npm test -- scripts/generate-static-pages.test.mjs`

Expected: PASS.

Run: `npm run lint`

Expected: PASS.

### Task 3: Full Verification

**Files:**
- All changed files.

- [ ] **Step 1: Run all tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: no ESLint errors.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: build succeeds and generated `dist` contains `/tools/`, core tool pages, expanded guides, trust pages, `sitemap.xml`, and `robots.txt`.

- [ ] **Step 4: Inspect route output**

Run: `node -e "import('./scripts/generate-static-pages.mjs').then(m => console.log(m.PAGE_ROUTES.map(p => p.path).join('\\n')))"`

Expected: output includes all V3 Phase 1 tool routes and at least 25 total public routes.
