export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}

// Fires the lead conversion to BOTH GA4 and the Meta Pixel so Meta can attribute
// and optimise ads for it. The pixel otherwise only ever sees PageView.
export function trackLead(params = {}) {
  trackEvent('qualify_lead', params)
  if (typeof window.fbq === 'function') window.fbq('track', 'Lead')
}
