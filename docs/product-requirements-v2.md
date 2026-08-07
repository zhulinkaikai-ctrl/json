# JSONFmt.org V2 Product Requirements

## Goal

Upgrade `https://jsonfmt.org/` from a single-page JSON utility into an AdSense-ready and SEO-ready English JSON tool site.

V2 keeps the V1 tool experience stable. The primary work is site trust, static content, navigation, and technical SEO.

## Scope

V2 adds:

- A top navigation with `Tool`, `Guides`, `About`, and `Contact`.
- Footer links to `Privacy Policy` and `Terms of Use`.
- A static `/guides/` index page.
- Six developer-focused guide pages:
  - `/guides/trailing-comma-in-json/`
  - `/guides/unexpected-token-in-json/`
  - `/guides/single-quotes-in-json/`
  - `/guides/unquoted-property-name-in-json/`
  - `/guides/unclosed-string-in-json/`
  - `/guides/comments-in-json/`
- Four trust pages:
  - `/privacy/`
  - `/terms/`
  - `/about/`
  - `/contact/`
- `sitemap.xml` and `robots.txt`.
- Per-page title, description, canonical URL, Open Graph tags, and JSON-LD where appropriate.

## Content Requirements

Each guide must be written in English for developers. The tone is practical and direct: explain the error, show invalid code, show fixed code, explain why strict JSON rejects the input, list common mistakes, and end with a CTA back to the tool.

Each guide targets 800-1200 English words. The first six topics are syntax-focused because they match the current V1 diagnostic engine.

The Contact page uses `zhulinkaikai@gmail.com`. About, Privacy, and Terms present the operator as the `JSON Formatter team`.

## Technical Requirements

The project remains Vite + React + TypeScript. Do not migrate to Astro or Next.js.

The homepage remains a React-powered tool. Additional V2 pages are static HTML generated into `dist` after the Vite build. Each page must be independently crawlable without client-side routing.

The site base URL is `https://jsonfmt.org/`.

## Advertising and Analytics

V2 does not include live AdSense code, AdSense verification code, Google Analytics, Plausible, or Umami.

Guide pages may include reserved ad-placement regions in the middle and near the end of the article. These regions must be clearly non-functional placeholders and must not load third-party scripts.

The Privacy Policy must disclose that JSON is processed locally in the browser and that future advertising services such as Google AdSense may use cookies or similar technologies.

## Non-goals

V2 does not add JSON tree view, JSONPath search, diff, schema generation, conversions, account features, cloud save, sharing links, or URL-based JSON prefill.

V2 does not move the tool to `/tool/`, replace the homepage with a content landing page, or add real ads.

## Acceptance Criteria

- `npm test`, `npm run lint`, and `npm run build` pass.
- The built `dist` directory contains all V2 route `index.html` files.
- `sitemap.xml` and `robots.txt` reference `https://jsonfmt.org/`.
- Each static page has title, description, canonical, and Open Graph tags.
- Guide pages include Article and FAQ JSON-LD.
- Homepage keeps the V1 JSON tool and adds V2 navigation/footer links.

