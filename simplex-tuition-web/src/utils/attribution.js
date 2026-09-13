// Lead-source attribution.
//
// Every page load is classified into a "touch": a `channel` that matches the
// Channel dropdown on the Enquiries tab (Google | Facebook | Referral | Other)
// plus a human-readable `detail` ("Google Business Profile", "Google search"…).
//
// Model: last non-direct touch with a 90-day lookback (same as GA4). A direct
// visit never overwrites a real source seen in the last 90 days; the very first
// touch is kept separately so we can see what introduced the family.
//
// "Referral" on the sheet means word of mouth, which the website can't see (a
// link shared on WhatsApp arrives with no referrer), so the site never assigns
// it. Direct visits are "Other" with a note to ask how they heard.

const KEY = 'simplex_attribution_v2'
const LEGACY_KEY = 'simplex_attribution'
const LOOKBACK_MS = 90 * 24 * 60 * 60 * 1000
const OWN_HOSTS = ['simplextuition.com.au', 'localhost', '127.0.0.1']

const PARAM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid']

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

const isOwnHost = (host) => OWN_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))

const has = (value, words) => words.some((w) => value.includes(w))

// Pure: given the URL query string and document.referrer, what brought them here?
export function classifyTouch({ search = '', referrer = '' } = {}) {
  const params = new URLSearchParams(search)
  const p = {}
  PARAM_KEYS.forEach((k) => {
    const v = params.get(k)
    if (v) p[k] = v
  })
  const src = (p.utm_source || '').toLowerCase()
  const med = (p.utm_medium || '').toLowerCase()
  const camp = (p.utm_campaign || '').toLowerCase()
  const refHost = hostOf(referrer)
  const externalRef = refHost && !isOwnHost(refHost) ? refHost : ''

  let channel = 'Other'
  let detail = 'Direct (typed, bookmark, or a link shared by text/WhatsApp)'
  let direct = true

  if (src || med || camp) {
    direct = false
    if (camp === 'gbp' || has(med, ['gbp', 'local', 'maps']) || has(src, ['gbp', 'gmb', 'business_profile'])) {
      channel = 'Google'; detail = 'Google Business Profile'
    } else if (has(src, ['google']) && has(med, ['cpc', 'ppc', 'paid'])) {
      channel = 'Google'; detail = 'Google Ads'
    } else if (has(src, ['google'])) {
      channel = 'Google'; detail = `Google (${med || 'tagged link'})`
    } else if (has(src, ['facebook', 'instagram', 'meta', 'fb', 'ig'])) {
      channel = 'Facebook'
      detail = has(med, ['cpc', 'paid', 'ad']) ? 'Facebook/Instagram ad' : 'Facebook/Instagram post'
    } else if (has(med, ['qr', 'print', 'flyer']) || has(src, ['qr', 'flyer', 'door', 'sign', 'stall'])) {
      channel = 'Other'; detail = `Print/QR (${src || med})`
    } else {
      channel = 'Other'; detail = `Tagged link (${[src, med].filter(Boolean).join(' / ')})`
    }
  } else if (p.gclid || p.gbraid || p.wbraid) {
    direct = false; channel = 'Google'; detail = 'Google Ads'
  } else if (p.fbclid) {
    direct = false; channel = 'Facebook'; detail = 'Facebook/Instagram link'
  } else if (externalRef) {
    direct = false
    if (/(^|\.)google\./.test(externalRef)) {
      channel = 'Google'; detail = externalRef.startsWith('maps.') ? 'Google Maps' : 'Google search'
    } else if (has(externalRef, ['facebook.com', 'instagram.com', 'fb.com', 'fb.me'])) {
      channel = 'Facebook'; detail = 'Facebook/Instagram'
    } else if (has(externalRef, ['bing.com', 'duckduckgo.com', 'yahoo.', 'ecosia.org'])) {
      channel = 'Other'; detail = `Search engine (${externalRef})`
    } else if (has(externalRef, ['chatgpt.com', 'openai.com', 'perplexity.ai', 'claude.ai', 'gemini.google'])) {
      channel = 'Other'; detail = `AI assistant (${externalRef})`
    } else {
      channel = 'Other'; detail = `Website (${externalRef})`
    }
  }

  return { channel, detail, direct, ...p, referrer: externalRef }
}

// Pure: fold a new touch into the stored state.
export function mergeTouch(state, touch, now = Date.now()) {
  const stamped = { ...touch, ts: now }
  const first = state?.first ?? stamped
  const last = state?.last
  const lastIsLiveSource = last && !last.direct && now - last.ts <= LOOKBACK_MS
  if (touch.direct && lastIsLiveSource) return { first, last }
  return { first, last: stamped }
}

// Call once on app load.
export function captureAttribution(win = typeof window === 'undefined' ? undefined : window) {
  if (!win) return
  try {
    const touch = classifyTouch({ search: win.location.search, referrer: win.document.referrer })
    touch.landing_page = win.location.pathname + win.location.search
    const stored = JSON.parse(win.localStorage.getItem(KEY) || 'null')
    win.localStorage.setItem(KEY, JSON.stringify(mergeTouch(stored, touch)))
    win.localStorage.removeItem(LEGACY_KEY)
  } catch {
    // localStorage can throw in private mode — attribution is best-effort.
  }
}

// Flat fields attached to every lead.
export function getAttribution(win = typeof window === 'undefined' ? undefined : window) {
  try {
    const { first, last } = JSON.parse(win.localStorage.getItem(KEY) || 'null') ?? {}
    if (!last) return { channel: 'Other', channel_detail: 'Unknown (no tracking data)' }
    const out = {
      channel: last.channel,
      channel_detail: last.detail,
      landing_page: last.landing_page ?? '',
      referrer: last.referrer ?? '',
      source_seen: new Date(last.ts).toISOString(),
    }
    PARAM_KEYS.forEach((k) => { if (last[k]) out[k] = last[k] })
    if (first && first.ts !== last.ts) {
      out.first_channel = first.channel
      out.first_channel_detail = first.detail
      out.first_seen = new Date(first.ts).toISOString()
    }
    return out
  } catch {
    return { channel: 'Other', channel_detail: 'Unknown (no tracking data)' }
  }
}
