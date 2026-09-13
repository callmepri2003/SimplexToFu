import { PHONE } from '../data/content'
import { trackEvent } from '../hooks/useAnalytics'
import { getAttribution } from './attribution'

const WA_NUMBER = PHONE.replace('+', '')
const DEFAULT_MESSAGE = "Hi Simplex, I'd like to book a free first lesson for my child."

export function whatsappUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`
}

// A WhatsApp tap is intent, not a confirmed lead, so Meta gets the standard
// Contact event and optimisation stays pointed at real form submissions (Lead).
export function trackWhatsApp(location) {
  const { channel, channel_detail } = getAttribution()
  trackEvent('whatsapp_clicked', { location, channel, channel_detail })
  if (typeof window.fbq === 'function') window.fbq('track', 'Contact')
}

export function trackPhone(location) {
  const { channel, channel_detail } = getAttribution()
  trackEvent('phone_clicked', { location, channel, channel_detail })
  if (typeof window.fbq === 'function') window.fbq('track', 'Contact')
}
