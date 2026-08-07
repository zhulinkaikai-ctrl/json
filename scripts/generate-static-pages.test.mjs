import { describe, expect, it } from 'vitest'

import {
  GUIDE_PAGES,
  PAGE_ROUTES,
  SITE_URL,
  TRUST_PAGES,
  buildRobotsTxt,
  buildSitemapXml,
  renderStaticPage,
} from './generate-static-pages.mjs'

describe('V2 static page registry', () => {
  it('defines the expected canonical site URL and route count', () => {
    expect(SITE_URL).toBe('https://jsonfmt.org')
    expect(PAGE_ROUTES).toHaveLength(12)
    expect(GUIDE_PAGES).toHaveLength(6)
    expect(TRUST_PAGES).toHaveLength(4)
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
    expect(html).toContain('Try it in JSON Error Finder')
    expect(html).not.toContain('adsbygoogle')
    expect(html).not.toContain('pagead2.googlesyndication.com')
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
})
