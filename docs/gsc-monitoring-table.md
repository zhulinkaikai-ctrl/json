# Google Search Console Monitoring Table

Chinese version: [gsc-monitoring-table.zh-CN.md](./gsc-monitoring-table.zh-CN.md)

Use this table weekly after SEO Phase 2 is deployed. Record the first data point 7 days after deployment, then update weekly. The goal is to decide the next SEO action from Search Console evidence, not guesswork.

## Weekly Page Tracking

| Week | URL | Primary keyword | Indexing status | Impressions | Clicks | CTR | Average position | Action |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| Week 1 | `/guides/json-parse-unexpected-token-o/` | JSON.parse unexpected token o | Pending | 0 | 0 | 0% | - | Request indexing after deploy. |
| Week 1 | `/guides/json-parse-unexpected-token-u/` | JSON.parse unexpected token u | Pending | 0 | 0 | 0% | - | Request indexing after deploy. |
| Week 1 | `/guides/unexpected-token-less-than-in-json/` | unexpected token < in JSON | Pending | 0 | 0 | 0% | - | Watch CTR after impressions appear. |
| Week 1 | `/json-error-finder/` | json error finder | Pending | 0 | 0 | 0% | - | Link from new guides. |
| Week 1 | `/fix-invalid-json/` | fix invalid json | Pending | 0 | 0 | 0% | - | Link from repair guides. |

## Decision Rules

| Signal | Meaning | Next action |
| --- | --- | --- |
| Indexed but 0 impressions after 14 days | Keyword may be too weak or page has too little discovery. | Add internal links and one external discovery link. |
| Impressions but CTR below 1% | Title or description is not compelling. | Rewrite title and meta description without changing URL. |
| Average position 20-50 | Google understands the page but ranks it weakly. | Expand examples, add related questions, and improve internal links. |
| Crawled, not indexed | Google may see low uniqueness or weak demand. | Add original troubleshooting value and link from stronger pages. |
| Not discovered | Google has not found the page reliably. | Check sitemap deployment, internal links, and external links. |

## Query Tracking

| Query | Target URL | Impressions | Clicks | Average position | Notes |
| --- | --- | ---: | ---: | ---: | --- |
| `JSON.parse unexpected token o` | `/guides/json-parse-unexpected-token-o/` | 0 | 0 | - | Phase 2 target. |
| `JSON.parse unexpected token u` | `/guides/json-parse-unexpected-token-u/` | 0 | 0 | - | Phase 2 target. |
| `unexpected token < in JSON` | `/guides/unexpected-token-less-than-in-json/` | 0 | 0 | - | Existing page, high-value target. |
| `invalid escape character in JSON` | `/guides/invalid-escape-character-in-json/` | 0 | 0 | - | Phase 2 target. |
| `empty response JSON parse error` | `/guides/empty-response-json-parse-error/` | 0 | 0 | - | Phase 2 target. |

## Weekly Routine

1. Open Search Console Performance.
2. Filter by page group `/guides/`.
3. Export queries and pages for the last 7 days.
4. Update the table above.
5. Pick only 3 pages to optimize each week.
6. Submit updated pages through URL Inspection only after meaningful content or title changes.
