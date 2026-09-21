import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import chain from './data/skillsChain.json'
import { chainFallbackHtml } from './chain/fallback'
import { setChainFallback } from './chain/fallbackStore'

// The chain page prerenders as a plain list of every skill (see src/chain/fallbackStore.js).
setChainFallback(chainFallbackHtml(chain))

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
