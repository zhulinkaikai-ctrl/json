# Homepage Two-Panel Workspace Implementation Plan

Chinese version: [2026-08-09-homepage-two-panel-workspace.zh-CN.md](./2026-08-09-homepage-two-panel-workspace.zh-CN.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage diagnostic sidebar with a command-driven, two-panel JSON input and read-only output workspace.

**Architecture:** Add a pure homepage workspace state module that computes action results and stale-result state from the input text. The React homepage consumes that module and renders the editable Monaco input on the left with a read-only result or diagnostic panel on the right. Tool-specific routes keep the existing tool page surface.

**Tech Stack:** React, TypeScript, Monaco Editor, Vitest, Lucide, CSS.

---

### Task 1: Homepage Workspace TDD

**Files:**
- Create: `src/lib/homepageWorkspace.test.ts`
- Create: `src/lib/homepageWorkspace.ts`

- [x] **Step 1: Write failing action-state tests**

```ts
expect(runHomepageAction('{"name":"Ada"}', 'format')).toMatchObject({
  kind: 'text',
  action: 'format',
  value: '{\n  "name": "Ada"\n}',
})

expect(runHomepageAction('{"name":"Ada",}', 'format')).toMatchObject({
  kind: 'diagnostic',
  action: 'format',
})

expect(isHomepageOutputStale('{"name":"Ada"}', {
  kind: 'text',
  action: 'format',
  value: '{\n  "name": "Ada"\n}',
  sourceInput: '{"name":"Ada"}',
})).toBe(true)
```

- [x] **Step 2: Verify RED**

Run: `npm test -- src/lib/homepageWorkspace.test.ts`

Expected: FAIL because the homepage workspace module does not exist.

- [x] **Step 3: Add minimal pure state implementation**

Create `runHomepageAction`, `isHomepageOutputStale`, and `getHomepageOutputText`. `format` and `minify` return text only for valid JSON. Invalid input returns the diagnostic from `diagnoseJson` and therefore replaces previous output.

- [x] **Step 4: Verify GREEN**

Run: `npm test -- src/lib/homepageWorkspace.test.ts`

Expected: PASS.

### Task 2: Homepage Workspace UI

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [x] **Step 1: Render the homepage command bar and two panels**

Use the pure workspace module in the homepage route. Keep source JSON in the left Monaco editor. Render the right panel as non-editable content with empty, formatted, minified, validation, diagnostic, and stale-result states.

- [x] **Step 2: Preserve input and add explicit result actions**

Use separate `inputValue` and `output` state. `Format`, `Validate`, and `Minify` must not call `setInputValue` with a transformed value. Enable `Copy Output` and `Use output as input` only when output text is available.

- [x] **Step 3: Keep tool-page routes stable**

Render the current single-editor diagnostic layout for non-home tool routes so generated SEO pages continue to load their route-specific interactive surface.

### Task 3: Verification

**Files:**
- All changed files.

- [x] **Step 1: Run tests**

Run: `npm test`

Expected: homepage workspace tests and existing diagnostics/static-generation tests pass.

- [x] **Step 2: Run lint**

Run: `npm run lint`

Expected: no ESLint errors.

- [x] **Step 3: Run build**

Run: `npm run build`

Expected: production build succeeds and static tool pages still contain their route-specific output.
