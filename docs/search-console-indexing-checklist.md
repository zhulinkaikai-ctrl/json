# Search Console Indexing Checklist

Chinese version: [search-console-indexing-checklist.zh-CN.md](./search-console-indexing-checklist.zh-CN.md)

Use this checklist after deploying `https://jsonfmt.org/`.

## 1. Verify The Property

Recommended method: add a Domain property in Google Search Console and verify it with DNS.

Alternative method: use the HTML tag verification option. Copy only the token value from Google and set it during build:

```bash
GOOGLE_SITE_VERIFICATION=your-token npm run build
```

The build will add the verification tag to the homepage and generated static pages:

```html
<meta name="google-site-verification" content="your-token">
```

## 2. Submit The Sitemap

Submit this sitemap in Search Console:

```text
https://jsonfmt.org/sitemap.xml
```

After deployment, confirm these URLs return `200`:

```text
https://jsonfmt.org/
https://jsonfmt.org/robots.txt
https://jsonfmt.org/sitemap.xml
```

## 3. Request Indexing For Core URLs

Use URL Inspection and request indexing for:

```text
https://jsonfmt.org/
https://jsonfmt.org/json-formatter/
https://jsonfmt.org/json-validator/
https://jsonfmt.org/json-minifier/
https://jsonfmt.org/json-error-finder/
https://jsonfmt.org/tools/
https://jsonfmt.org/guides/
```

## 4. Watch The First Signals

Check Search Console again after 24 to 72 hours:

- Page indexing: submitted URLs should move out of "Discovered" or "Crawled" states.
- Sitemaps: submitted sitemap should show discovered URLs.
- Performance: impressions may arrive before clicks.

Google can crawl or index slowly for new sites, so use Search Console statuses rather than `site:jsonfmt.org` alone.
