import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/site.css'
import App from './App'
import { captureAttribution } from './utils/attribution'

captureAttribution()

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// The build prerenders each route and stamps #root with the path it rendered
// ("404" for the not-found page). Hydrate only when that markup is for this
// URL; a dev server or SPA fallback serves other markup, so render fresh.
const prerendered = container.dataset.prerendered
const here = window.location.pathname.replace(/(.)\/$/, '$1')
if (prerendered && (prerendered === here || prerendered === '404')) {
  hydrateRoot(container, app)
} else {
  container.textContent = ''
  createRoot(container).render(app)
}
