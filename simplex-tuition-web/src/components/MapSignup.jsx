import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CHAIN_PATH, MAP_LANDING } from '../data/skillsChainCopy'
import { trackEvent, trackSignup } from '../hooks/useAnalytics'
import { getAttribution } from '../utils/attribution'
import { grantMapAccess } from '../utils/mapAccess'
import { ArrowRight } from './icons'

const COPY = MAP_LANDING.form

// One field: an email, in exchange for the maths skills map. Every extra field costs sign-ups.
//
// `topic` is what the parent tapped in the preview, if anything. It changes the button
// ("Show me all 29 skills"), travels with the sign-up, and decides where on the map they land.
// `hasAccess` swaps the form for a plain way in, for a parent who has already signed up here.
export default function MapSignup({ location, topic = null, next = '', hasAccess = false, dark = false }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [gotcha, setGotcha] = useState('')
  const [sending, setSending] = useState(false)

  const destination = `${CHAIN_PATH}${next || (topic ? `#path=${topic.id}` : '')}`

  if (hasAccess) {
    return (
      <div className={`map-form${dark ? ' on-dark' : ''}`} data-cy={`map-form-${location}`}>
        <p className="map-form-back">{COPY.returning}</p>
        <Link className="btn btn-primary btn-block" to={destination} data-cy="map-open">{COPY.open} <ArrowRight /></Link>
      </div>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    const attribution = getAttribution()
    let sent = false
    try {
      const res = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          offer: 'skills-map',
          form_location: location,
          ...(topic ? { stuck_on: topic.topic } : {}),
          ...attribution,
          _gotcha: gotcha,
          _subject: `Skills map sign-up — ${email}${topic ? ` · looking at ${topic.topic}` : ''} · ${attribution.channel_detail}`,
        }),
      })
      sent = res.ok
    } catch {
      sent = false
    }
    // If our form service is down, the parent still gets what they came for. Losing one email is
    // better than turning away someone an ad just paid to bring here; the failure is reported so
    // it can be seen and fixed.
    if (sent) trackSignup({ location, topic: topic?.chip ?? '', channel: attribution.channel })
    else trackEvent('map_signup_error', { location })
    grantMapAccess('email')
    navigate(destination)
  }

  const id = `${location}-email`
  return (
    <form className={`map-form${dark ? ' on-dark' : ''}`} onSubmit={submit} data-cy={`map-form-${location}`}>
      <div className="field">
        <label htmlFor={id}>{COPY.label}</label>
        <input id={id} type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} data-cy="map-email" required />
      </div>
      {/* Honeypot: hidden from people, irresistible to spam bots. */}
      <input type="text" name="_gotcha" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={gotcha} onChange={(e) => setGotcha(e.target.value)} />
      <button type="submit" className="btn btn-primary btn-block" disabled={sending} data-cy="map-submit">
        {sending ? 'Opening…' : topic ? COPY.buttonFor(topic.count) : COPY.button} {!sending && <ArrowRight />}
      </button>
      <p className="map-form-foot">{COPY.foot}</p>
      <p className="map-form-privacy">{COPY.privacy}</p>
    </form>
  )
}
