import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'

// Build-time only: scripts/prerender.js imports the SSR bundle of this file.
export { applySeo } from './seo/html'
export { seoForPath, sitemapXml, PRERENDER_PATHS } from './seo/pages'

export function render(path) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </StrictMode>
  )
}
