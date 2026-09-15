# JSONFmt SEO Next Steps Roadmap

Updated: 2026-09-15

Chinese version: [seo-next-steps-roadmap-2026-09.zh-CN.md](./seo-next-steps-roadmap-2026-09.zh-CN.md)

## Objective

Turn existing Search Console impressions into qualified clicks and tool usage without expanding the site with thin pages. JSONFmt should become a browser-local JSON error diagnosis and repair center for developers.

## Current baseline

The Search Console export dated 2026-09-01 showed approximately 3,776 impressions and 2 clicks. Most impressions were below position 20, so the immediate problem is ranking depth and authority rather than a lack of URLs. The previous implementation added static routes, priority entry links, fast repair paths, and error-cluster internal links.

The next measurement window starts after the latest deployed build is live and the sitemap has been submitted. Do not compare new page changes against the old baseline until at least 7 days of new data are available.

## First 14 days

1. Deploy the latest build and verify that `/robots.txt` and `/sitemap.xml` return `200`.
2. Submit `https://jsonfmt.org/sitemap.xml` in Google Search Console.
3. Request recrawls for the homepage, `/tools/`, `/guides/`, the main validator/error-finder pages, and the highest-impression guides.
4. Export Search Console data once after 7 days and again after 14 days.
5. Record page, query, impressions, clicks, CTR, average position, and indexing state in the monitoring table.
6. Do not change more than three pages in one week. Preserve the URL when testing title or content changes.

## Four-week execution cycle

### Week 1: indexing and measurement

- Confirm the deployed HTML contains a self-referencing canonical, one H1, useful internal links, and the correct sitemap entry.
- Track `/guides/response-json-is-not-a-function/` because its previous average position was close to page one.
- Track `/guides/unexpected-token-in-json/`, `/guides/json-parse-error/`, `/guides/`, and the homepage as the primary discovery set.

### Week 2: improve pages that are already visible

- If a page has impressions but average position is 20 or worse, improve the first answer, invalid/fixed examples, troubleshooting order, and contextual internal links.
- If a page reaches positions 8-20, test its title, meta description, H1, and first paragraph for a clearer promise.
- If a page reaches the top 8 but CTR remains weak, sharpen the search-result promise around the exact error and the repair outcome.

### Week 3: create one external discovery asset

- Publish one original developer article about a real JSON failure, such as an API returning HTML and causing `Unexpected token < in JSON`.
- Link to the matching JSONFmt guide from the article and explain a real debugging sequence rather than copying the guide.
- Add JSONFmt to a relevant GitHub README or examples repository with useful sample payloads.

### Week 4: decide from evidence

- Keep improving existing pages if impressions are growing but most rankings remain below 20.
- Add one new guide only when Search Console shows a repeated query with no accurate page, or when real users report a missing error case.
- Do not add broad converter pages until the corresponding tool is fully implemented and tested.

## Page decision rules

| Signal | Interpretation | Action |
| --- | --- | --- |
| Indexed, 14 days, 0 impressions | Google has not found a useful demand or discovery signal yet. | Strengthen internal links and add one relevant external discovery link. |
| Impressions, average position 50+ | The page matches weakly or lacks authority. | Add unique debugging evidence, examples, and contextual links. |
| Average position 20-50 | Google understands the topic but the page is not competitive yet. | Expand the repair workflow and related questions. |
| Average position 8-20, low CTR | The result is visible but not compelling. | Test title, description, H1, and first answer without changing the URL. |
| Average position 1-8, low CTR | The page is eligible for clicks but the promise is unclear. | Make the exact error and repair outcome more explicit. |

## Product and trust priorities

1. Keep the interactive editor and diagnostics near the top of tool pages.
2. Link each classified error to its matching guide and each guide back to the relevant tool.
3. Keep JSON processing browser-local and never send pasted content to analytics.
4. Expand the About and Privacy pages with a clear maintenance scope and privacy model.
5. Cite primary references such as RFC 8259, MDN `JSON.parse()`, and the Fetch `Response.json()` documentation where they support an explanation.

## What not to do yet

- Do not buy backlinks or submit to large numbers of low-quality directories.
- Do not change URLs for title experiments.
- Do not update dates without making a substantive content change.
- Do not add live advertising until organic clicks and tool usage are stable for several weeks.
- Do not publish many pages that repeat the same explanation with a different keyword.

## Success criteria for the next review

At the next 14-day review, compare the new export with the current baseline and answer:

- Are more pages indexed?
- Are the priority pages moving toward the top 20?
- Which exact queries have the highest impressions?
- Which pages receive impressions but no clicks?
- Are users moving from guides to validator/error finder pages?

The next code change should be chosen from those answers, not from total impressions alone.
