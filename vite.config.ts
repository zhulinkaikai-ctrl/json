import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), searchConsoleVerification()],
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

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
