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

// An email given for the maths skills map. Deliberately NOT a lead: `qualify_lead` and Meta's
// `Lead` mean a parent asked to be called, and ads are optimised on them. This is a softer step,
// so it gets GA4's standard `sign_up` and Meta's `CompleteRegistration`.
export function trackSignup(params = {}) {
  trackEvent('sign_up', { method: 'skills_map', ...params })
  if (typeof window.fbq === 'function') window.fbq('track', 'CompleteRegistration')
}


// A parent reading the page after she has already given her number (the instant-form thank-you
// screen sends her to /what-happens-next). Not a lead and not a sign-up: Meta's standard
// ViewContent, so an audience of "leads who kept reading" can be built without touching Lead.
export function trackViewContent(params = {}) {
  trackEvent('view_content', params)
  if (typeof window.fbq === 'function') window.fbq('track', 'ViewContent', params)
}
