import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// gtag and the Meta Pixel only see the first page load of a single-page app.
// This reports every later route change (suburb pages, /thank-you) as a page
// view. Rendered after <Routes> so the new page has already set its title.
export default function RouteTracker() {
  const { pathname, search } = useLocation()
  const firstLoad = useRef(true)

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false
      return
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_location: window.location.href, page_title: document.title })
    }
    if (typeof window.fbq === 'function') window.fbq('track', 'PageView')
  }, [pathname, search])

  return null
}
