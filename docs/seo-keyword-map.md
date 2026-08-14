# JSONFmt SEO Keyword Map

Updated: 2026-08-12

This map keeps each indexable page focused on one primary keyword so JSONFmt can build topical authority without pages competing against each other.

Chinese version: [seo-keyword-map.zh-CN.md](./seo-keyword-map.zh-CN.md)

## Core Tool Pages

| URL | Primary | Secondary intent | Search intent | Page role |
| --- | --- | --- | --- | --- |
| `/` | Primary: json formatter and validator | online JSON formatter, validate JSON, minify JSON | Mixed tool intent | Broad homepage for users who want one fast JSON workspace. |
| `/tools/` | Primary: JSON tools | JSON formatter tools, JSON validator tools, JSON minifier | Tool hub | Internal linking hub for all task pages. |
| `/json-formatter/` | Primary: json formatter | format JSON online, JSON formatter online, beautify JSON | Tool action | Owns the broad formatting task. |
| `/json-validator/` | Primary: json validator | validate JSON online, check JSON syntax, JSON syntax checker | Tool action | Owns strict syntax validation. |
| `/json-minifier/` | Primary: json minifier | minify JSON online, compress JSON, compact JSON | Tool action | Owns compact output and whitespace removal. |
| `/json-beautifier/` | Primary: json beautifier | beautify JSON online, pretty JSON, readable JSON | Tool action | Captures users who use "beautifier" language. |
| `/json-pretty-print/` | Primary: json pretty print | pretty print JSON online, JSON pretty printer | Tool action | Captures pretty-print phrasing without cannibalizing formatter. |
| `/json-error-finder/` | Primary: json error finder | find JSON error, JSON syntax error finder, JSON parse error tool | Diagnostic tool | Owns line/column error discovery. |
| `/fix-invalid-json/` | Primary: fix invalid json | repair JSON syntax, invalid JSON checker, JSON fix guide | Diagnostic tool | Owns repair-oriented users who need guidance. |
| `/json-viewer/` | Primary: json viewer | view JSON online, JSON reader, readable JSON viewer | Tool action | Owns viewing and inspection language. |

## Existing Guide Cluster

| URL | Primary | Intent |
| --- | --- | --- |
| `/guides/trailing-comma-in-json/` | Primary: trailing comma in JSON | Error repair |
| `/guides/unexpected-token-in-json/` | Primary: unexpected token in JSON | Error repair |
| `/guides/single-quotes-in-json/` | Primary: single quotes in JSON | Error repair |
| `/guides/unquoted-property-name-in-json/` | Primary: unquoted property name in JSON | Error repair |
| `/guides/unclosed-string-in-json/` | Primary: unclosed string in JSON | Error repair |
| `/guides/comments-in-json/` | Primary: comments in JSON | Error repair |
| `/guides/how-to-format-json/` | Primary: how to format JSON | How-to |
| `/guides/how-to-validate-json/` | Primary: how to validate JSON | How-to |
| `/guides/how-to-minify-json/` | Primary: how to minify JSON | How-to |
| `/guides/json-formatter-vs-validator/` | Primary: json formatter vs validator | Comparison |

## Long-Tail Guide Cluster

| URL | Primary | Secondary intent | Search intent | Links to |
| --- | --- | --- | --- | --- |
| `/guides/unexpected-end-of-json-input/` | Primary: unexpected end of JSON input | JSON.parse unexpected end, end of JSON input error | Error repair | `/json-error-finder/`, `/json-validator/` |
| `/guides/bad-control-character-in-json/` | Primary: bad control character in JSON | bad control character in string literal, invalid control character JSON | Error repair | `/json-error-finder/`, `/json-validator/` |
| `/guides/missing-comma-in-json/` | Primary: missing comma in JSON | expected comma JSON, JSON comma error, missing comma after property | Error repair | `/json-error-finder/`, `/json-formatter/` |
| `/guides/expected-double-quoted-property-name/` | Primary: expected double-quoted property name | object keys must be quoted, property name JSON error | Error repair | `/json-error-finder/`, `/json-validator/` |
| `/guides/json-parse-error/` | Primary: JSON parse error | JSON.parse error, parse invalid JSON, JSON syntax error | Error repair | `/json-error-finder/`, `/json-validator/` |
| `/guides/unexpected-token-less-than-in-json/` | Primary: unexpected token < in JSON | response returned HTML, fetch response.json error | Error repair | `/json-error-finder/`, `/json-validator/` |
| `/guides/strict-json-vs-json5/` | Primary: strict JSON vs JSON5 | JSON5 comments, strict JSON syntax, JSON5 vs JSON | Format choice | `/json-validator/`, `/guides/comments-in-json/` |
| `/guides/is-online-json-formatter-safe/` | Primary: is online JSON formatter safe | private JSON formatter, browser-local JSON tool, safe JSON validation | Trust and safety | `/json-formatter/`, `/privacy/` |

## Phase 2 Runtime Error Guide Cluster

| URL | Primary | Secondary intent | Search intent | Links to |
| --- | --- | --- | --- | --- |
| `/guides/json-parse-unexpected-token-o/` | Primary: JSON.parse unexpected token o | [object Object] JSON parse, parse already parsed object | Runtime parse error | `/json-error-finder/`, `/guides/unexpected-token-object-object-in-json/` |
| `/guides/json-parse-unexpected-token-u/` | Primary: JSON.parse unexpected token u | JSON.parse undefined, localStorage parse undefined | Runtime parse error | `/json-error-finder/`, `/guides/unexpected-token-undefined-in-json/` |
| `/guides/unexpected-token-nan-in-json/` | Primary: Unexpected token NaN in JSON | NaN invalid JSON, JSON.stringify NaN | Runtime parse error | `/json-validator/`, `/fix-invalid-json/` |
| `/guides/unexpected-token-infinity-in-json/` | Primary: Unexpected token Infinity in JSON | Infinity invalid JSON, finite JSON numbers | Runtime parse error | `/json-validator/`, `/fix-invalid-json/` |
| `/guides/unexpected-token-undefined-in-json/` | Primary: Unexpected token undefined in JSON | undefined invalid JSON, JSON null vs undefined | Runtime parse error | `/json-validator/`, `/guides/json-parse-unexpected-token-u/` |
| `/guides/unterminated-string-literal-in-json/` | Primary: Unterminated string literal in JSON | missing quote JSON, unescaped quote JSON | Error repair | `/json-error-finder/`, `/guides/unclosed-string-in-json/` |
| `/guides/invalid-escape-character-in-json/` | Primary: Invalid escape character in JSON | JSON backslash error, Windows path JSON escape | Error repair | `/json-error-finder/`, `/json-validator/` |
| `/guides/invalid-unicode-escape-in-json/` | Primary: Invalid Unicode escape in JSON | JSON unicode escape, invalid \\u escape | Error repair | `/json-error-finder/`, `/json-validator/` |
| `/guides/unexpected-token-bom-in-json/` | Primary: Unexpected token BOM in JSON | JSON byte order mark, hidden character JSON | Error repair | `/json-error-finder/`, `/json-validator/` |
| `/guides/empty-response-json-parse-error/` | Primary: Empty response JSON parse error | response.json empty body, 204 JSON parse | Runtime parse error | `/json-error-finder/`, `/guides/unexpected-end-of-json-input/` |
| `/guides/response-json-is-not-a-function/` | Primary: response.json is not a function | fetch response json error, axios response.data | Runtime workflow | `/guides/content-type-text-html-json-error/`, `/json-validator/` |
| `/guides/body-stream-already-read-json/` | Primary: body stream already read JSON | response body already consumed, fetch parse once | Runtime workflow | `/guides/empty-response-json-parse-error/`, `/json-validator/` |
| `/guides/unexpected-non-whitespace-character-after-json/` | Primary: Unexpected non-whitespace character after JSON | multiple JSON objects, extra text after JSON | Error repair | `/json-error-finder/`, `/guides/extra-data-after-json/` |
| `/guides/duplicate-keys-in-json/` | Primary: Duplicate keys in JSON | repeated JSON properties, duplicate object keys | Data quality | `/json-viewer/`, `/json-validator/` |
| `/guides/extra-data-after-json/` | Primary: Extra data after JSON | multiple JSON values, NDJSON vs JSON | Error repair | `/json-error-finder/`, `/guides/unexpected-non-whitespace-character-after-json/` |
| `/guides/unexpected-token-object-object-in-json/` | Primary: Unexpected token object Object in JSON | [object Object] JSON, stringify object correctly | Runtime parse error | `/guides/json-parse-unexpected-token-o/`, `/json-validator/` |
| `/guides/truncated-json-response/` | Primary: Truncated JSON response | incomplete JSON response, missing closing brace API | Runtime parse error | `/json-error-finder/`, `/guides/unexpected-end-of-json-input/` |
| `/guides/missing-comma-in-json-array/` | Primary: Missing comma in JSON array | array separator JSON, expected comma in array | Error repair | `/json-error-finder/`, `/guides/missing-comma-in-json/` |
| `/guides/leading-zero-in-json-number/` | Primary: Leading zero in JSON number | invalid JSON number, ZIP code JSON string | Error repair | `/json-validator/`, `/fix-invalid-json/` |
| `/guides/content-type-text-html-json-error/` | Primary: Content-Type text/html JSON error | API returned HTML, response.json unexpected token | Runtime parse error | `/guides/unexpected-token-less-than-in-json/`, `/json-error-finder/` |

## Content Rules

- One page, one primary keyword.
- Tool pages should satisfy action intent quickly and keep the working JSON editor near the top.
- Guide pages should answer the exact error in the first 100 words, show invalid and fixed JSON, and link back to the most relevant tool.
- Related links should connect formatter, validator, minifier, error finder, and guide pages so no new page is orphaned.
- Do not publish thin conversion pages until the matching tool actually works.
