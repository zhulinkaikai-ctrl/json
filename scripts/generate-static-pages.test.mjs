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

const keywordMapPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../docs/seo-keyword-map.md',
)

describe('V3 static page registry', () => {
  it('defines the expected canonical site URL and entry-page route count', () => {
    expect(SITE_URL).toBe('https://jsonfmt.org')
    expect(PAGE_ROUTES.length).toBeGreaterThanOrEqual(33)
    expect(GUIDE_PAGES).toHaveLength(18)
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

  it('documents the keyword map for every core tool page and first long-tail batch', () => {
    const keywordMap = readFileSync(keywordMapPath, 'utf8')

    for (const page of [...TOOL_PAGES, ...GUIDE_PAGES]) {
      expect(keywordMap).toContain(page.path)
      expect(keywordMap).toContain(`Primary: ${page.primaryKeyword}`)
    }

    for (const slug of [
      'unexpected-end-of-json-input',
      'bad-control-character-in-json',
      'missing-comma-in-json',
    ]) {
      expect(keywordMap).toContain(`/guides/${slug}/`)
    }
  })

  it('groups the guides index by search intent and links every guide once', () => {
    expect(GUIDE_GROUPS.map((group) => group.title)).toEqual([
      'JSON syntax errors',
      'Formatting and validation workflows',
      'Safety and format choices',
    ])

    const groupedSlugs = GUIDE_GROUPS.flatMap((group) => group.slugs)
    expect(new Set(groupedSlugs).size).toBe(GUIDE_PAGES.length)
    expect(groupedSlugs).toEqual(expect.arrayContaining(GUIDE_PAGES.map((page) => page.slug)))

    const html = renderStaticPage(GUIDES_INDEX)
    expect(html).toContain('JSON syntax errors')
    expect(html).toContain('Formatting and validation workflows')
    expect(html).toContain('Safety and format choices')
    expect(html).toContain('href="/guides/is-online-json-formatter-safe/"')
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
