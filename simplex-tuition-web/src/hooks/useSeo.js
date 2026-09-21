import { useEffect } from 'react'

// Keeps <head> in step with the page after a client-side navigation. The first
// load already has the right tags baked in by the prerender (src/seo/html.js);
// this hook writes the same values, so every page must call it.
// Pass a stable object (module constant or useMemo), not a fresh literal.
export function useSeo(seo) {
  useEffect(() => {
    const head = document.head

    const setMeta = (attr, key, value) => {
      let el = head.querySelector(`meta[${attr}="${key}"]`)
      if (!value) {
        if (el) el.remove()
        return
      }
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    document.title = seo.title
    setMeta('name', 'description', seo.description)
    setMeta('name', 'robots', seo.robots || 'index, follow')
    setMeta('property', 'og:title', seo.ogTitle || seo.title)
    setMeta('property', 'og:description', seo.ogDescription || seo.description)
    setMeta('property', 'og:url', seo.canonical)
    setMeta('name', 'twitter:title', seo.ogTitle || seo.title)
    setMeta('name', 'twitter:description', seo.ogDescription || seo.description)

    let canonicalEl = head.querySelector('link[rel="canonical"]')
    if (!seo.canonical) {
      if (canonicalEl) canonicalEl.remove()
    } else {
      if (!canonicalEl) {
        canonicalEl = document.createElement('link')
        canonicalEl.setAttribute('rel', 'canonical')
        head.appendChild(canonicalEl)
      }
      canonicalEl.setAttribute('href', seo.canonical)
    }

    // Replace whichever page's JSON-LD is there (prerendered or from the last route).
    const clearJsonLd = () => head.querySelectorAll('script[data-page-jsonld]').forEach((s) => s.remove())
    clearJsonLd()
    if (seo.jsonLd) {
      const ldScript = document.createElement('script')
      ldScript.type = 'application/ld+json'
      ldScript.setAttribute('data-page-jsonld', 'true')
      ldScript.textContent = JSON.stringify(seo.jsonLd)
      head.appendChild(ldScript)
    }

    return clearJsonLd
  }, [seo])
}
