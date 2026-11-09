// Sends each web lead to the Google Apps Script web app bound to the
// "Simplex Billing v3" sheet, which writes it into the Enquiries tab.
// See integrations/enquiries-sheet/README.md for setup.
//
// Formspree stays the source of truth (email + archive). This call is
// best-effort: Apps Script can't answer CORS preflight, so it's a no-cors
// text/plain POST whose response we can't read, with keepalive so it survives
// the redirect to /thank-you.

const MAX = 200

const clip = (v) => String(v ?? '').slice(0, MAX)

export function buildEnquiry({ form, concern, location, suburb, attribution, stuckOn = '' }) {
  return {
    token: import.meta.env.VITE_ENQUIRIES_TOKEN ?? '',
    name: clip(form.name),
    phone: clip(form.phone),
    yearLevel: clip(form.yearLevel),
    concern: clip(concern),
    channel: clip(attribution.channel),
    channelDetail: clip(attribution.channel_detail),
    firstChannelDetail: clip(attribution.first_channel_detail),
    formLocation: clip(location),
    suburb: clip(suburb),
    landingPage: clip(attribution.landing_page),
    // From the maths skills chain: the skill the parent was looking at. The sheet ignores
    // fields it has no column for, so this is safe before the Apps Script is updated.
    stuckOn: clip(stuckOn),
  }
}

// A Groundwork booking needs an answer, because the script refuses a slot that was taken in the
// meantime (`slot_taken`). Apps Script answers a text/plain POST after a redirect, which browsers
// follow and read when the request is a plain CORS one. If the answer cannot be read at all
// (blocked, offline), this resolves to null and the caller books on the strength of its own
// pre-check: a clash then shows in the calendar rather than on the page.
export async function bookSlot(enquiry) {
  const url = import.meta.env.VITE_ENQUIRIES_WEBHOOK_URL
  if (!url) return null
  try {
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(enquiry),
    })
    const data = await res.json()
    return data && typeof data.ok === 'boolean' ? data : null
  } catch {
    return null
  }
}

export function sendToEnquiriesSheet(enquiry) {
  const url = import.meta.env.VITE_ENQUIRIES_WEBHOOK_URL
  if (!url) return
  try {
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(enquiry),
    }).catch(() => {})
  } catch {
    // Never let the sheet hand-off break a lead.
  }
}
