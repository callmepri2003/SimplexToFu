import { useEffect } from 'react'

const DEFAULT_TITLE = 'Simplex Tuition — Maths & English Tutoring, Austral Sydney'
const DEFAULT_CANONICAL = 'https://simplextuition.com.au'

// Imperatively manage per-page <head> (title, meta, canonical, JSON-LD) for the
// client-rendered pages. Googlebot renders the DOM after JS and reads these.
// Everything is restored on unmount so pages don't leak tags into each other.
export function useSeo({ title, description, canonical, jsonLd }) {
  useEffect(() => {
    const prevTitle = document.title
    if (title) document.title = title

    const touched = []
    const upsertMeta = (attr, key, value) => {
      if (!value) return
      let el = document.head.querySelector(`meta[${attr}="${key}"]`)
      const created = !el
      if (created) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      touched.push({ el, created, prev: el.getAttribute('content') })
      el.setAttribute('content', value)
    }

    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)

    let canonicalEl = document.head.querySelector('link[rel="canonical"]')
    const prevCanonical = canonicalEl ? canonicalEl.getAttribute('href') : null
    if (canonical) {
      if (!canonicalEl) {
        canonicalEl = document.createElement('link')
        canonicalEl.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalEl)
      }
      canonicalEl.setAttribute('href', canonical)
    }

    // Remove any page-scoped JSON-LD left behind, then add this page's.
    document.head.querySelectorAll('script[data-page-jsonld]').forEach((s) => s.remove())
    let ldScript
    if (jsonLd) {
      ldScript = document.createElement('script')
      ldScript.type = 'application/ld+json'
      ldScript.setAttribute('data-page-jsonld', 'true')
      ldScript.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(ldScript)
    }

    return () => {
      document.title = prevTitle
      touched.forEach(({ el, created, prev }) => {
        if (created) el.remove()
        else if (prev !== null) el.setAttribute('content', prev)
      })
      if (canonicalEl) canonicalEl.setAttribute('href', prevCanonical || DEFAULT_CANONICAL)
      if (ldScript) ldScript.remove()
    }
  }, [title, description, canonical, jsonLd])
}

export { DEFAULT_TITLE, DEFAULT_CANONICAL }
