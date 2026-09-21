import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Makes `vite preview` answer like Vercel does for the prerendered build, so
// the Cypress run in CI tests what production serves: the redirects listed in
// vercel.json, and 404.html with a 404 status for any URL that isn't a page.
function previewLikeVercel() {
  return {
    name: 'preview-like-vercel',
    configurePreviewServer(server) {
      const dist = join(server.config.root, server.config.build.outDir)
      const { redirects = [] } = JSON.parse(readFileSync(join(server.config.root, 'vercel.json'), 'utf8'))

      return () => server.middlewares.use((req, res, next) => {
        const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/(.)\/$/, '$1')
        const redirect = redirects.find((r) => r.source === path)
        if (redirect) {
          res.writeHead(redirect.permanent ? 308 : 307, { Location: redirect.destination })
          return res.end()
        }
        // Vite has already rewritten a known route to its file (/tutoring -> /tutoring.html).
        const isPage = path.endsWith('.html') && existsSync(join(dist, path))
        if (isPage || !req.headers.accept?.includes('text/html')) return next()
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end(readFileSync(join(dist, '404.html')))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ isPreview }) => ({
  plugins: [react(), previewLikeVercel()],
  // No SPA fallback in preview: every route has its own prerendered HTML file.
  appType: isPreview ? 'mpa' : 'spa',
}))
