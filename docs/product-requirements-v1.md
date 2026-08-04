# JSON Error Finder - Product Requirements Document (V1)

## 1. Product Summary

JSON Error Finder is an English, privacy-first web tool for developers who need to diagnose invalid JSON quickly. The product is a single-page application whose primary job is to help a user move from invalid JSON to valid JSON without uploading or saving their data.

Primary positioning: **JSON Error Finder / Fix Invalid JSON**.

## 2. Problem Statement

Developers frequently paste JSON from API responses, logs, configuration files, and documentation into online tools. Existing formatters commonly report only that JSON is invalid or expose a raw parser message. They often fail to clearly identify where the problem is, why it is invalid, and how to fix it.

The generic JSON formatter category is crowded. V1 therefore differentiates on human-readable error diagnosis rather than attempting to be a broad JSON tool suite.

## 3. Target User and Core Job

**Target user:** English-speaking developers working with APIs and structured data.

**Core job:** When a developer has invalid JSON, help them identify the syntax error and manually repair it in the same browser session.

## 4. V1 Solution

The homepage is the tool. A user can paste JSON, type directly, import a local `.json` file, drag a file into the editor, or load an example. The tool validates input after a short debounce.

The primary interface uses a desktop-first development-tool layout:

- A Monaco editor for JSON input and inline error markers.
- A diagnostic panel that shows the current state.
- A compact action toolbar for format, minify, copy, clear, sample loading, and local file import.

For invalid JSON, the tool highlights the failure location and shows an English explanation, line and column, nearby context, and a manual fix suggestion. It must not auto-repair or rewrite invalid input. For valid JSON, the tool enables format, minify, and copy actions.

## 5. Functional Requirements

### Input and validation

- Accept pasted text, direct editor input, `.json` file import, and drag-and-drop import.
- Validate strict standard JSON only.
- Debounce validation after input changes.
- Support normal use for inputs up to 10 MB.
- Show an explicit oversized-input state above 10 MB and skip parsing.

### Diagnostics

- Render `empty`, `editing`, `valid`, `invalid`, `oversize`, and `file error` states.
- Mark the failure location in the editor when JSON is invalid.
- Provide line/column, an English explanation, nearby context, and a fix suggestion.
- Classify common errors when possible: missing comma, trailing comma, unclosed string, single quotes, comments, unquoted object keys, invalid control characters, and bracket mismatch.

### Actions

- `Format` and `Minify` are available only for valid JSON.
- `Copy` copies the current editor content when content exists.
- `Clear` empties the editor.
- `Load sample` replaces the editor content with a valid sample.
- `Import file` opens a local `.json` file.

## 6. Privacy and Analytics

JSON is parsed and transformed in the browser only. V1 does not upload, store, synchronize, or share JSON input. It does not have accounts.

Anonymous analytics may record page views, input method, coarse input-size bucket, validation state, normalized error category, and action clicks. It must never record JSON text, fields, values, file names, error snippets, clipboard content, user IDs, or URLs containing user data.

The primary anonymous success funnel is:

`json_invalid_detected -> diagnosis_viewed -> json_became_valid`

## 7. Technical Constraints

- Vite + React + TypeScript.
- Monaco Editor.
- Static deployment to Vercel, Netlify, or Cloudflare Pages.
- No server-side JSON parsing.
- No account, database, or JSON persistence layer.
- Desktop browser experience is the priority.
- Basic mobile readability is desirable but not a V1 optimization target.

## 8. Non-goals

- Accounts, cloud saving, sharing links, and team collaboration.
- HTTP requests, API environments, or API-client features.
- Automatic JSON repair.
- JSON5 or other permissive JSON modes.
- Tree view, JSONPath, diff, schema generation, code generation, data conversion, and multi-tool navigation.
- Advertising, sponsorship prompts, and paid tiers.

## 9. Success Criteria

- At least 100 English organic-search visits in the first 30 days after launch.
- At least 30% of invalid-JSON sessions change from invalid to valid after diagnosis is shown.
- Automated tests cover core JSON diagnosis, common error classifications, actions, file-input limits, and oversized-input handling.
- The tool never transmits or stores user JSON content.

