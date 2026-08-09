# JSONFmt.org V3 Product Requirements: Traffic Entry Expansion

## 1. Why V3 Exists

JSONFmt currently has a useful core tool and a small set of error guides, but the site has too few search and navigation entry points. A user can land on the homepage or one of a few syntax-error articles, but there is no broad tool matrix for common JSON intents such as formatter, validator, minifier, viewer, escape/unescape, or conversions.

The competitor reference, `https://jsonformatter.org/`, acts less like a single formatter and more like a tool network. Its homepage links to many related utilities, repeated JSON-specific tasks, conversion pages, FAQ content, article content, and footer categories. V3 should respond by turning JSONFmt into a crawlable, privacy-first JSON tool site with many focused entry pages.

V3 does not copy the competitor. It uses the competitor insight to fix JSONFmt's current gap: one strong tool is not enough if users and search engines have too few ways to enter the site.

## 2. Product Goal

Expand `https://jsonfmt.org/` from a JSON error finder with supporting guides into a multi-entry JSON utility site.

Primary V3 outcome:

- A visitor searching for "json formatter", "json validator", "json minifier", "fix invalid json", or common JSON parse errors should land on a page that matches that exact intent.
- Every important page should link users back into the working browser-local JSON tool.
- Every tool or guide page should be independently crawlable, indexable, internally linked, and useful without client-side routing.

## 3. Positioning

### Current positioning

JSONFmt is currently positioned as:

- JSON Error Finder
- Fix invalid JSON
- Strict JSON validator

This is differentiated, but narrow.

### V3 positioning

JSONFmt should be positioned as:

**Privacy-first JSON formatter, validator, and error finder for developers.**

Supporting claims:

- Format, validate, minify, and debug JSON locally in the browser.
- No upload, no storage, no account.
- Clear explanations for invalid JSON instead of raw parser messages.

## 4. Target Search Intents

V3 should map one primary intent to one primary page. Do not make one generic page try to rank for every query.

### Tool intent

- `json formatter`
- `json formatter online`
- `json beautifier`
- `json pretty print`
- `json validator`
- `json checker`
- `json minifier`
- `json viewer`
- `json error finder`
- `fix invalid json`

### Error intent

- `trailing comma in json`
- `unexpected token in json`
- `unexpected end of json input`
- `single quotes in json`
- `unquoted property name in json`
- `comments in json`
- `bad control character in json`
- `json parse error`
- `expected double quoted property name`
- `missing comma in json`

### Conversion and transformation intent

These can be phased in after the core tool pages:

- `json to string`
- `string to json`
- `json escape`
- `json unescape`
- `json sort keys`
- `json to csv`
- `csv to json`
- `json to xml`
- `xml to json`

## 5. Required Route Structure

### Core tool pages

Each page must have its own title, H1, meta description, canonical URL, intro copy, FAQ, related links, and a working local tool surface.

- `/json-formatter/`
- `/json-validator/`
- `/json-minifier/`
- `/json-beautifier/`
- `/json-pretty-print/`
- `/json-error-finder/`
- `/fix-invalid-json/`
- `/json-viewer/`
- `/tools/`

The homepage remains a working tool, but its metadata should target the broadest mixed intent:

- Title: `JSON Formatter and Validator - JSONFmt`
- H1: `JSON formatter, validator, and error finder`

### Transformation pages

Phase 2 should add pages that are still privacy-first and browser-local:

- `/json-escape/`
- `/json-unescape/`
- `/json-to-string/`
- `/string-to-json/`
- `/json-sorter/`

Phase 3 may add conversion pages only when the feature is truly implemented:

- `/json-to-csv/`
- `/csv-to-json/`
- `/json-to-xml/`
- `/xml-to-json/`

Do not publish thin conversion pages that only say "coming soon."

### Guide pages

Keep the six V2 guide pages and expand to at least 18 total guide pages:

- `/guides/how-to-format-json/`
- `/guides/how-to-validate-json/`
- `/guides/how-to-minify-json/`
- `/guides/json-formatter-vs-validator/`
- `/guides/unexpected-end-of-json-input/`
- `/guides/bad-control-character-in-json/`
- `/guides/missing-comma-in-json/`
- `/guides/expected-double-quoted-property-name/`
- `/guides/json-parse-error/`
- `/guides/json-stringify-vs-json-parse/`
- `/guides/strict-json-vs-json5/`
- `/guides/is-online-json-formatter-safe/`

## 6. Homepage Requirements

The homepage should become the strongest product and SEO entry point while keeping the current editor-first experience.

Required sections:

- Top navigation: `Formatter`, `Validator`, `Minifier`, `Error Finder`, `Guides`, `Tools`.
- Above-the-fold tool: paste/edit JSON immediately.
- Mode control: `Format`, `Validate`, `Minify`, `Find errors`.
- Outcome panel: valid summary, syntax error diagnosis, formatted output, or minified output.
- Task entry grid: links to core tool pages.
- Error guide grid: links to the highest-value syntax guides.
- Privacy band: explains browser-local processing.
- FAQ: answers upload/privacy, strict JSON, formatting, validation, minifying, and JSON5 support.
- Footer tool matrix: core tools, transformations, guides, trust pages.

The homepage should avoid becoming a marketing page. The first screen must still be the usable JSON tool.

## 7. Tool Page Requirements

Each tool page should reuse the shared JSON tool engine but customize the surrounding intent:

- Formatter pages should default to a formatting task and emphasize readable indentation.
- Validator pages should default to validation and error diagnosis.
- Minifier pages should default to minification and output size reduction.
- Error finder pages should emphasize line/column, explanation, and fix suggestion.
- Viewer pages may initially reuse formatted output with a structured summary, but should later add tree navigation.

Each tool page needs:

- Self-referencing canonical URL.
- Unique title and meta description.
- One H1.
- A short first paragraph containing the primary keyword.
- The working tool above or near the fold.
- 4-6 FAQ items visible on the page.
- Related JSON tools links.
- Related guide links.
- Breadcrumb JSON-LD.
- SoftwareApplication JSON-LD where appropriate.

## 8. Content Requirements

Guide pages should be practical and developer-focused. Each guide should:

- Answer the core question in the first 100 words.
- Show invalid and fixed JSON examples when relevant.
- Explain why strict JSON accepts or rejects the syntax.
- Include a short troubleshooting checklist.
- Link to the most relevant tool page.
- Link to 2-4 related guides.
- Include visible FAQ content and FAQ JSON-LD.
- Stay unique enough to avoid doorway-page or duplicate-content risk.

Target length:

- Core tool pages: 500-900 words of supporting visible content.
- Error guides: 900-1,400 words.
- Transformation guides: 700-1,100 words.

## 9. Internal Linking Requirements

V3 must make every important page discoverable through multiple paths.

Required link surfaces:

- Header navigation to the top 4 tools and guide hub.
- `/tools/` hub listing every tool category.
- `/guides/` hub grouped by error, formatting, validation, and safety.
- Related tools module on every tool page.
- Related guides module on every guide page.
- Footer matrix with core tools, transformations, guides, and trust pages.
- Breadcrumb links on all non-home pages.
- Homepage task grid linking to all core tool pages.

No core page should be orphaned. Every new route should appear in `sitemap.xml`.

## 10. Technical Requirements

The project remains:

- Vite
- React
- TypeScript
- Static deployment
- Browser-local JSON processing

Implementation direction:

- Extract the current JSON editor and diagnostic UI into reusable components.
- Introduce route/page configuration for tool pages and guide pages.
- Keep pages independently crawlable as built HTML files.
- Avoid server-side JSON parsing.
- Avoid accounts, databases, saved documents, or URL-prefilled private JSON.
- Keep the 10 MB local processing limit unless performance testing proves a higher limit is safe.

## 11. Privacy and Analytics

JSON content must never be uploaded, logged, stored, sent to analytics, or embedded in URLs.

Allowed analytics:

- Page views.
- Referrer category.
- Tool mode selected.
- Coarse input-size bucket.
- Validation state.
- Error category.
- Action clicks.

Disallowed analytics:

- Raw JSON text.
- Keys, values, snippets, or file names.
- Clipboard content.
- URL parameters containing user JSON.
- User-identifiable debugging payloads.

## 12. Non-goals

V3 should not include:

- Copying competitor branding or UI.
- Publishing fake tools that do not work.
- User accounts.
- Cloud saving.
- Shareable JSON links.
- Server-side parsing.
- Live ads before the content and traffic base is stronger.
- Paid plans.
- Auto-repair that rewrites user JSON without explicit review.

## 13. Phasing

### Phase 1: Fix the entry problem

Ship core route expansion:

- Homepage repositioning.
- `/tools/` hub.
- Formatter, validator, minifier, beautifier, pretty-print, error-finder, and fix-invalid-json pages.
- Expanded footer and internal link modules.
- Updated sitemap and tests.

### Phase 2: Add transformation intent

Ship:

- JSON escape and unescape.
- JSON to string and string to JSON.
- JSON key sorter.
- Supporting guides.

### Phase 3: Add conversion intent

Ship only when the tools are real:

- JSON to CSV.
- CSV to JSON.
- JSON to XML.
- XML to JSON.
- Comparison or diff tools if there is a clear implementation path.

## 14. Acceptance Criteria

V3 is complete when:

- The site has at least 25 indexable, internally linked pages.
- The homepage still provides a working JSON tool in the first viewport.
- The build outputs static HTML for all tool, guide, trust, sitemap, and robots routes.
- Every indexable page has title, meta description, canonical, Open Graph tags, and relevant JSON-LD.
- Every core tool page has a visible working browser-local tool.
- Every guide page links to a relevant tool page and at least two related pages.
- `sitemap.xml` contains every public route.
- `robots.txt` references the sitemap.
- `npm test`, `npm run lint`, and `npm run build` pass.
- No code path uploads or stores JSON input.

## 15. Success Metrics

Track after launch:

- Google Search Console impressions for core tool queries.
- Organic clicks to `/json-formatter/`, `/json-validator/`, `/json-minifier/`, and `/fix-invalid-json/`.
- Percentage of organic visitors who interact with the editor.
- Invalid-to-valid sessions after diagnosis is shown.
- Indexed page count.
- Pages with impressions but low CTR, for title/meta iteration.

30-day target:

- 25+ indexed pages.
- 500+ total Google Search Console impressions.
- 100+ organic visits.
- 30%+ invalid sessions become valid after diagnosis.

