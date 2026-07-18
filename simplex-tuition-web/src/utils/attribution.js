const KEY = 'simplex_attribution'
const PARAM_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'fbclid',
]

// Records where a visitor came from so it can be attached to the lead on submit.
// Call once on app load. A visit that carries campaign tags (UTMs / click ids)
// becomes the attributed source; otherwise we record the referrer of the first
// ever visit. Stored in localStorage so it survives across sessions.
export function captureAttribution() {
  if (typeof window === 'undefined') return
  try {
    const params = new URLSearchParams(window.location.search)
    const fresh = {}
    for (const k of PARAM_KEYS) {
      const v = params.get(k)
      if (v) fresh[k] = v
    }

    const stored = getAttribution()
    if (Object.keys(fresh).length > 0) {
      localStorage.setItem(KEY, JSON.stringify({
        ...fresh,
        referrer: document.referrer || '',
        landing_page: window.location.pathname + window.location.search,
      }))
    } else if (Object.keys(stored).length === 0) {
      localStorage.setItem(KEY, JSON.stringify({
        referrer: document.referrer || '',
        landing_page: window.location.pathname + window.location.search,
      }))
    }
  } catch {
    // localStorage can throw in private mode — attribution is best-effort.
  }
}

export function getAttribution() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}
