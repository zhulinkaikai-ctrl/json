import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  GUIDE_GROUPS,
  GUIDES_INDEX,
  GUIDE_PAGES,
  HOME_PAGE,
  PAGE_ROUTES,
  SITE_URL,
  TOOL_PAGES,
  TOOLS_INDEX,
  TRUST_PAGES,
  buildRobotsTxt,
  buildSitemapXml,
  renderStaticPage,
} from './generate-static-pages.mjs'
import { PHASE2_GUIDE_SLUGS } from './phase2-guides.mjs'

const keywordMapPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../docs/seo-keyword-map.md',
)

describe('V3 static page registry', () => {
  it('defines the expected canonical site URL and entry-page route count', () => {
    expect(SITE_URL).toBe('https://jsonfmt.org')
    expect(PAGE_ROUTES.length).toBeGreaterThanOrEqual(53)
    expect(GUIDE_PAGES).toHaveLength(38)
    expect(TOOL_PAGES).toHaveLength(8)
    expect(TRUST_PAGES).toHaveLength(4)
    expect(TOOLS_INDEX.path).toBe('/tools/')
    expect(HOME_PAGE.title).toContain('JSON Formatter')
    expect(HOME_PAGE.description).toMatch(/validate/i)

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

    expect(GUIDE_PAGES.map((page) => page.path)).toEqual(expect.arrayContaining([
      '/guides/unexpected-end-of-json-input/',
      '/guides/bad-control-character-in-json/',
      '/guides/missing-comma-in-json/',
      '/guides/expected-double-quoted-property-name/',
      '/guides/json-parse-error/',
      '/guides/unexpected-token-less-than-in-json/',
      '/guides/strict-json-vs-json5/',
      '/guides/is-online-json-formatter-safe/',
    ]))
    expect(GUIDE_PAGES.map((page) => page.slug)).toEqual(expect.arrayContaining(PHASE2_GUIDE_SLUGS))
  })

  it('sharpens the homepage and the main discovery pages for search intent', () => {
    expect(HOME_PAGE).toMatchObject({
      title: 'JSON Formatter, Validator, Minifier & Error Finder | JSONFmt',
      description: 'Format, validate, minify, and repair strict JSON locally in your browser with browser-only tools for API payloads, configs, and logs.',
    })

    expect(TOOL_PAGES.find((page) => page.slug === 'json-error-finder')).toMatchObject({
      title: 'JSON Error Finder - Find the First Strict JSON Error',
      description: 'Use this JSON error finder in your browser to find the first strict JSON error, see the line and column, and repair the payload without uploading it.',
      summary: 'Use this JSON error finder to locate the first strict JSON syntax error, understand why it happened, and repair the text without sending it to a server.',
    })

    expect(TOOL_PAGES.find((page) => page.slug === 'fix-invalid-json')).toMatchObject({
      title: 'Fix Invalid JSON - Diagnose and Repair Strict JSON Errors',
      description: 'Fix invalid JSON by checking line and column, understanding the parser message, and making the smallest correct repair in your browser.',
      summary: 'Fix invalid JSON by diagnosing the blocking parser error and making the smallest correct repair.',
    })

    expect(GUIDE_PAGES.find((page) => page.slug === 'unexpected-token-less-than-in-json')).toMatchObject({
      title: 'Unexpected Token < in JSON: API Returned HTML',
      description: 'Fix unexpected token < in JSON errors by checking whether an API returned HTML instead of JSON, then validating the real response body.',
      summary: 'Unexpected token < in JSON usually means the parser received HTML from a login page, redirect, or error route.',
    })

    expect(GUIDE_PAGES.find((page) => page.slug === 'json-parse-unexpected-token-o')).toMatchObject({
      title: 'JSON.parse unexpected token o: Fix [object Object] Errors',
      description: 'Fix JSON.parse unexpected token o errors by checking whether an object was parsed again or converted to [object Object] before parsing.',
      summary: 'JSON.parse unexpected token o usually means the parser received [object Object] or a value that was already parsed.',
    })
  })

  it('aligns high-impression guides with their Search Console queries', () => {
    const expectedPages = {
      'unexpected-token-in-json': {
        title: 'Unexpected Token in JSON at Position 0: Causes and Fixes',
        description: 'Fix unexpected token in JSON at position 0 by checking empty responses, HTML error pages, BOM characters, and non-JSON text before calling JSON.parse.',
        summary: 'Unexpected token in JSON at position 0 usually means the parser received an empty body, HTML, a hidden character, or other non-JSON text.',
        relatedGuideSlugs: [
          'unexpected-token-less-than-in-json',
          'empty-response-json-parse-error',
          'json-parse-error',
        ],
      },
      'single-quotes-in-json': {
        title: 'Single Quotes in JSON: Can JSON Use Single Quotes?',
        description: 'Fix single quotes in JSON by replacing invalid delimiters with double quotes and checking whether the source is JavaScript, JSON5, or strict JSON.',
        summary: 'Single quotes in JSON are invalid in the strict format. Replace delimiters with double quotes, then validate the complete document.',
        relatedGuideSlugs: [
          'strict-json-vs-json5',
          'unquoted-property-name-in-json',
          'expected-double-quoted-property-name',
        ],
      },
      'unexpected-non-whitespace-character-after-json': {
        title: 'Unexpected Non-Whitespace Character After JSON: Fix Extra Data',
        description: 'Fix unexpected non-whitespace character after JSON errors by removing logs, concatenated values, or extra text after the first JSON document.',
        summary: 'Unexpected non-whitespace character after JSON means the parser finished one value and found extra data after it.',
        relatedGuideSlugs: [
          'extra-data-after-json',
          'body-stream-already-read-json',
          'truncated-json-response',
        ],
      },
    }

    for (const [slug, expected] of Object.entries(expectedPages)) {
      const page = GUIDE_PAGES.find((guidePage) => guidePage.slug === slug)

      expect(page, slug).toMatchObject(expected)
      expect(page.title.length, slug).toBeLessThanOrEqual(62)
      expect(page.sections[0].paragraphs[0].toLowerCase(), slug).toContain(
        expected.title.split(':')[0].toLowerCase(),
      )
    }

    const unexpectedTokenHtml = renderStaticPage(
      GUIDE_PAGES.find((page) => page.slug === 'unexpected-token-in-json'),
    )
    const singleQuotesHtml = renderStaticPage(
      GUIDE_PAGES.find((page) => page.slug === 'single-quotes-in-json'),
    )
    const extraDataHtml = renderStaticPage(
      GUIDE_PAGES.find((page) => page.slug === 'unexpected-non-whitespace-character-after-json'),
    )

    expect(unexpectedTokenHtml).toContain('href="/guides/unexpected-token-less-than-in-json/"')
    expect(singleQuotesHtml).toContain('href="/guides/strict-json-vs-json5/"')
    expect(extraDataHtml).toContain('href="/guides/extra-data-after-json/"')
  })

  it('renders the homepage as a crawlable editor-first entry page', () => {
    const html = renderStaticPage(HOME_PAGE, {
      cssLinks: ['/assets/index-test.css'],
      scriptLinks: ['/assets/index-test.js'],
    })

    expect(html).toContain('<div id="root">')
    expect(html).toContain('<h1>JSON formatter, validator, and error finder</h1>')
    expect(html).toContain('Format, validate, minify, and repair strict JSON locally in your browser')
    expect(html).toContain('href="/json-formatter/"')
    expect(html).toContain('href="/json-validator/"')
    expect(html).toContain('href="/guides/unexpected-token-less-than-in-json/"')
    expect(html).toContain('<script type="module" crossorigin src="/assets/index-test.js"></script>')
  })

  it('uses absolute canonical URLs on every static route', () => {
    for (const page of PAGE_ROUTES) {
      expect(page.canonical).toBe(`${SITE_URL}${page.path}`)
      expect(page.title.length).toBeGreaterThan(10)
      expect(page.description.length).toBeGreaterThan(50)
    }
  })

  it('renders article and FAQ structured data on guide pages', () => {
    const html = renderStaticPage(GUIDE_PAGES[0])

    expect(html).toContain('"@type":"Article"')
    expect(html).toContain('"@type":"FAQPage"')
    expect(html).toContain('Updated August 12, 2026')
    expect(html).toContain('Try it in JSON Error Finder')
    expect(html).not.toContain('adsbygoogle')
    expect(html).not.toContain('pagead2.googlesyndication.com')
  })

  it('renders the site icon and social preview image on static pages', () => {
    const html = renderStaticPage(GUIDE_PAGES[0])

    expect(html).toContain('<link rel="icon" type="image/png" href="/JSON.png">')
    expect(html).toContain('<link rel="apple-touch-icon" href="/JSON.png">')
    expect(html).toContain('<meta property="og:image" content="https://jsonfmt.org/JSON.png">')
    expect(html).toContain('<meta name="twitter:image" content="https://jsonfmt.org/JSON.png">')
  })

  it('renders a crawlable interactive shell and related links on tool pages', () => {
    const html = renderStaticPage(TOOL_PAGES[0], {
      scriptLinks: ['/assets/index-test.js'],
    })

    expect(html).toContain('id="root"')
    expect(html).toContain('type="module"')
    expect(html).toContain('<meta name="robots" content="index,follow">')
    expect(html).toContain('"@type":"SoftwareApplication"')
    expect(html).toContain('"@type":"BreadcrumbList"')
    expect(html).toContain('Related JSON tools')
    expect(html).toContain('Related guides')
    expect(html).toContain('href="/privacy/"')
    expect(html).toContain('href="/terms/"')
    expect(html).toContain('href="/contact/"')
    expect(html).toContain('https://static.cloudflareinsights.com/beacon.min.js')
    expect(html).toContain('1247ce6193f744b0b365cd24ef117245')
  })

  it('keeps tool pages mapped to unique keywords with useful FAQ depth', () => {
    const primaryKeywords = new Set()

    for (const page of TOOL_PAGES) {
      expect(page.title.length, page.slug).toBeGreaterThanOrEqual(38)
      expect(page.title.length, page.slug).toBeLessThanOrEqual(62)
      expect(page.heading.toLowerCase(), page.slug).toContain(page.primaryKeyword)
      expect(page.summary.toLowerCase(), page.slug).toContain(page.primaryKeyword)
      expect(page.description.toLowerCase(), page.slug).toContain(page.primaryKeyword)
      expect(page.sections.length, page.slug).toBeGreaterThanOrEqual(4)
      expect(page.faq.length, page.slug).toBeGreaterThanOrEqual(4)
      expect(page.faq.length, page.slug).toBeLessThanOrEqual(6)
      expect(primaryKeywords.has(page.primaryKeyword), page.slug).toBe(false)
      primaryKeywords.add(page.primaryKeyword)
    }
  })

  it('documents the keyword map for every core tool page and long-tail guide', () => {
    const keywordMap = readFileSync(keywordMapPath, 'utf8')

    for (const page of [...TOOL_PAGES, ...GUIDE_PAGES]) {
      expect(keywordMap).toContain(page.path)
      expect(keywordMap).toContain(`Primary: ${page.primaryKeyword}`)
    }

    for (const slug of PHASE2_GUIDE_SLUGS) {
      expect(keywordMap).toContain(`/guides/${slug}/`)
    }
  })

  it('groups the guides index by search intent and links every guide once', () => {
    expect(GUIDE_GROUPS.map((group) => group.title)).toEqual([
      'JSON syntax errors',
      'Formatting and validation workflows',
      'Safety and format choices',
      'Runtime and serialization errors',
    ])

    const groupedSlugs = GUIDE_GROUPS.flatMap((group) => group.slugs)
    expect(new Set(groupedSlugs).size).toBe(GUIDE_PAGES.length)
    expect(groupedSlugs).toEqual(expect.arrayContaining(GUIDE_PAGES.map((page) => page.slug)))

    const html = renderStaticPage(GUIDES_INDEX)
    expect(html).toContain('JSON syntax errors')
    expect(html).toContain('Formatting and validation workflows')
    expect(html).toContain('Safety and format choices')
    expect(html).toContain('Runtime and serialization errors')
    expect(html).toContain('href="/guides/is-online-json-formatter-safe/"')
  })

  it('keeps Phase 2 guides within the long-tail quality contract', () => {
    for (const slug of PHASE2_GUIDE_SLUGS) {
      const page = GUIDE_PAGES.find((guidePage) => guidePage.slug === slug)

      expect(page, slug).toBeDefined()
      expect(page.title.toLowerCase(), slug).toContain(page.primaryKeyword.toLowerCase())
      expect(page.description.toLowerCase(), slug).toContain(page.primaryKeyword.toLowerCase())
      expect(page.sections, slug).toHaveLength(5)
      expect(page.faq, slug).toHaveLength(4)
    }
  })

  it('ships the external submission checklist and Search Console monitoring template', () => {
    const submissionChecklist = readFileSync(
      path.resolve(path.dirname(keywordMapPath), 'seo-external-submission-checklist.md'),
      'utf8',
    )
    const monitoringTable = readFileSync(
      path.resolve(path.dirname(keywordMapPath), 'gsc-monitoring-table.md'),
      'utf8',
    )

    expect(submissionChecklist).toContain('GitHub')
    expect(submissionChecklist).toContain('Do not buy links')
    expect(monitoringTable).toContain('Impressions')
    expect(monitoringTable).toContain('Indexing status')
  })

  it('keeps every guide within the V2 target word-count range', () => {
    for (const page of GUIDE_PAGES) {
      const text = [
        page.title,
        page.summary,
        page.invalidCode,
        page.fixedCode,
        ...page.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
        ...page.faq.flat(),
      ].join(' ')
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length

      expect(wordCount, page.slug).toBeGreaterThanOrEqual(800)
      expect(wordCount, page.slug).toBeLessThanOrEqual(1200)
    }
  })

  it('builds a sitemap with every canonical route', () => {
    const sitemap = buildSitemapXml()

    for (const page of PAGE_ROUTES) {
      expect(sitemap).toContain(`<loc>${page.canonical}</loc>`)
    }
  })

  it('builds robots.txt pointing to the generated sitemap', () => {
    expect(buildRobotsTxt()).toContain('Allow: /')
    expect(buildRobotsTxt()).toContain(`${SITE_URL}/sitemap.xml`)
  })

  it('renders Search Console verification metadata only when configured', () => {
    const originalVerificationToken = process.env.GOOGLE_SITE_VERIFICATION

    try {
      delete process.env.GOOGLE_SITE_VERIFICATION
      expect(renderStaticPage(TOOL_PAGES[0])).not.toContain('google-site-verification')

      process.env.GOOGLE_SITE_VERIFICATION = 'search-console-token'
      expect(renderStaticPage(TOOL_PAGES[0])).toContain(
        '<meta name="google-site-verification" content="search-console-token">',
      )
    } finally {
      if (originalVerificationToken === undefined) {
        delete process.env.GOOGLE_SITE_VERIFICATION
      } else {
        process.env.GOOGLE_SITE_VERIFICATION = originalVerificationToken
      }
    }
  })
})
