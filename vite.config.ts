import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const CLOUDFLARE_WEB_ANALYTICS_TOKEN = '1247ce6193f744b0b365cd24ef117245'

export default defineConfig({
  plugins: [react(), searchConsoleVerification(), cloudflareWebAnalytics()],
})

function searchConsoleVerification() {
  return {
    name: 'search-console-verification',
    transformIndexHtml(html: string) {
      const token = process.env.GOOGLE_SITE_VERIFICATION?.trim()
      if (!token) return html

      const verificationMeta = `<meta name="google-site-verification" content="${escapeHtml(token)}" />`
      return html.replace('</head>', `    ${verificationMeta}\n  </head>`)
    },
  }
}

function cloudflareWebAnalytics() {
  return {
    name: 'cloudflare-web-analytics',
    transformIndexHtml(html: string) {
      return injectAnalyticsScript(html)
    },
  }
}

function injectAnalyticsScript(html: string) {
  if (!CLOUDFLARE_WEB_ANALYTICS_TOKEN) return html

  const script = `<!-- Cloudflare Web Analytics --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "${CLOUDFLARE_WEB_ANALYTICS_TOKEN}"}'></script><!-- End Cloudflare Web Analytics -->`
  return html.replace('</body>', `    ${script}\n  </body>`)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
