import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CONCERNS, YEAR_LEVELS, PHONE, PHONE_DISPLAY } from '../data/content'
import { trackEvent, trackLead } from '../hooks/useAnalytics'
import { getAttribution } from '../utils/attribution'
import { buildEnquiry, sendToEnquiriesSheet } from '../utils/enquiries'
import { whatsappUrl, trackWhatsApp, trackPhone } from '../utils/contact'
import { ArrowRight, WhatsApp } from './icons'

const FREE_LESSON = {
  id: 'free-lesson',
  title: 'Book a free first lesson',
  submit: 'Book my free lesson',
  foot: 'Free. No contract.',
  subject: 'New free lesson request',
}

// Three required fields and one optional tap. Nothing hidden gates the button:
// if a required field is empty the browser says which one.
//
// `offer` swaps the wording when the form is asking for something other than the free lesson.
// `context` is what the page already knows about why the parent is here (the maths skills chain
// passes the skill they were looking at and the year they tapped). It is shown back to them,
// suggests the year, and travels with the lead so the first call starts in the right place.
export default function LeadForm({ location, suburb, title, dark = false, offer: offerOverride = null, context = null }) {
  const offer = { ...FREE_LESSON, ...offerOverride, ...(title ? { title } : {}) }
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', yearLevel: '' })
  const [gotcha, setGotcha] = useState('')
  const [concern, setConcern] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const started = useRef(false)

  const markStarted = () => {
    if (started.current) return
    started.current = true
    trackEvent('form_started', { location })
  }

  // A year tapped on the chain is a suggestion: anything the parent chooses here wins.
  const yearLevel = form.yearLevel || (YEAR_LEVELS.includes(context?.year) ? context.year : '')
  const stuckOn = context?.stuckOn ?? ''

  const update = (field, value) => {
    markStarted()
    setForm({ ...form, [field]: value })
  }

  const pickConcern = (id) => {
    markStarted()
    setConcern(concern === id ? '' : id)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const concernLabel = CONCERNS.find((c) => c.id === concern)?.label ?? ''
    try {
      const attribution = getAttribution()
      const res = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          yearLevel,
          concern: concernLabel,
          offer: offer.id,
          ...(stuckOn ? { stuck_on: stuckOn, earlier_skills: context.earlierSkills ?? '' } : {}),
          form_location: location,
          ...(suburb ? { suburb } : {}),
          ...attribution,
          _gotcha: gotcha,
          _subject: `${offer.subject} — ${form.name} (${yearLevel})${stuckOn ? ` · stuck on ${stuckOn}` : ''} · ${attribution.channel_detail}`,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      // Bots fill the hidden field; Formspree discards those, so don't log them either.
      if (!gotcha) sendToEnquiriesSheet(buildEnquiry({ form: { ...form, yearLevel }, concern: concernLabel, location, suburb, attribution, stuckOn }))
      trackLead({ location, concern, year_level: yearLevel, offer: offer.id, channel: attribution.channel, channel_detail: attribution.channel_detail })
      navigate('/thank-you', { state: { offer: offer.id } })
    } catch {
      trackEvent('form_error', { location })
      setError(`Sorry, that didn't send. Please try again, or call ${PHONE_DISPLAY}.`)
      setSubmitting(false)
    }
  }

  const id = (field) => `${location}-${field}`

  return (
    <form className={`lead-form${dark ? ' on-dark' : ''}`} onSubmit={handleSubmit} data-cy={`lead-form-${location}`}>
      <h3 className="lead-title">{offer.title}</h3>
      <p className="lead-sub">Leave your number and we'll call you back within 24 hours to find a time.</p>

      {stuckOn && <p className="lead-context" data-cy="form-context">You were looking at: <strong>{stuckOn}</strong></p>}

      <div className="field">
        <label htmlFor={id('name')}>Your name</label>
        <input id={id('name')} type="text" autoComplete="given-name" value={form.name} onChange={(e) => update('name', e.target.value)} data-cy="form-name" required />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor={id('phone')}>Mobile number</label>
          <input id={id('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="04xx xxx xxx" minLength={8} value={form.phone} onChange={(e) => update('phone', e.target.value)} data-cy="form-phone" required />
        </div>
        <div className="field">
          <label htmlFor={id('year')}>Child's year</label>
          <select id={id('year')} value={yearLevel} onChange={(e) => update('yearLevel', e.target.value)} data-cy="form-year-level" required>
            <option value="">Choose</option>
            {YEAR_LEVELS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <fieldset className="field concerns">
        <legend>What's on your mind? <span className="optional">(optional)</span></legend>
        <div className="chips">
          {CONCERNS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip${concern === c.id ? ' on' : ''}`}
              aria-pressed={concern === c.id}
              onClick={() => pickConcern(c.id)}
              data-cy={`form-concern-${c.id}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Honeypot: hidden from people, irresistible to spam bots. */}
      <input type="text" name="_gotcha" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={gotcha} onChange={(e) => setGotcha(e.target.value)} />

      {error && <p className="form-error" role="alert" data-cy="form-error">{error}</p>}

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting} data-cy="form-submit">
        {submitting ? 'Sending…' : offer.submit} {!submitting && <ArrowRight />}
      </button>

      <p className="lead-foot">
        {offer.foot ? `${offer.foot} ` : ''}Rather text?{' '}
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp(`form-${location}`)} data-cy="form-whatsapp">
          <WhatsApp /> WhatsApp us
        </a>
        {' '}or call <a href={`tel:${PHONE}`} onClick={() => trackPhone(`form-${location}`)}>{PHONE_DISPLAY}</a>
      </p>
    </form>
  )
}
