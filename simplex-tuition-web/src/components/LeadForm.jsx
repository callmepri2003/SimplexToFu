import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CONCERNS, YEAR_LEVELS, PHONE, PHONE_DISPLAY } from '../data/content'
import { trackEvent, trackLead } from '../hooks/useAnalytics'
import { getAttribution } from '../utils/attribution'
import { buildEnquiry, sendToEnquiriesSheet } from '../utils/enquiries'
import { whatsappUrl, trackWhatsApp, trackPhone } from '../utils/contact'
import { ArrowRight, WhatsApp } from './icons'

// Three steps, because the first action should cost nothing: one tap, then her
// own situation said back to her, and only then a request for her number.
// Nothing is ever hidden behind a disabled button — if a field is missing the
// browser says which, which is what the previous form got wrong.
const STEPS = ["So what's going wrong?", 'What year?', 'Your number']

export default function LeadForm({ location, suburb, label = 'Book a free lesson', dark = false }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', yearLevel: '' })
  const [concern, setConcern] = useState('')
  const [gotcha, setGotcha] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const started = useRef(false)

  const chosen = CONCERNS.find((c) => c.id === concern)

  const go = (next) => {
    setStep(next)
    trackEvent('form_step', { location, step: next + 1, step_name: STEPS[next] })
  }

  const pickConcern = (id) => {
    if (!started.current) {
      started.current = true
      trackEvent('form_started', { location })
    }
    setConcern(id)
    go(1)
  }

  const pickYear = (e) => {
    const yearLevel = e.target.value
    setForm({ ...form, yearLevel })
    if (yearLevel) go(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const concernLabel = chosen?.label ?? ''
    try {
      const attribution = getAttribution()
      const res = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          concern: concernLabel,
          form_location: location,
          ...(suburb ? { suburb } : {}),
          ...attribution,
          _gotcha: gotcha,
          _subject: `New free lesson request — ${form.name} (${form.yearLevel}) · ${attribution.channel_detail}`,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      // Bots fill the hidden field; Formspree discards those, so don't log them either.
      if (!gotcha) sendToEnquiriesSheet(buildEnquiry({ form, concern: concernLabel, location, suburb, attribution }))
      trackLead({ location, concern, year_level: form.yearLevel, channel: attribution.channel, channel_detail: attribution.channel_detail })
      navigate('/thank-you')
    } catch {
      trackEvent('form_error', { location })
      setError(`Sorry, that didn't send. Please try again, or call ${PHONE_DISPLAY}.`)
      setSubmitting(false)
    }
  }

  const id = (field) => `${location}-${field}`

  return (
    <div className={`lead-form${dark ? ' on-dark' : ''}`} data-cy={`lead-form-${location}`}>
      <p className="lead-label">{label}</p>
      <div className="lead-head">
        <h3 className="lead-title">{STEPS[step]}</h3>
        <ol className="lead-dots" aria-label={`Step ${step + 1} of 3`}>
          {STEPS.map((s, i) => <li key={s} className={i <= step ? 'on' : ''} />)}
        </ol>
      </div>

      {step === 0 && (
        <div className="lead-step" data-cy="step-concern">
          <div className="picks">
            {CONCERNS.map((c) => (
              <button key={c.id} type="button" className="pick" onClick={() => pickConcern(c.id)} data-cy={`form-concern-${c.id}`}>
                <span>{c.label}</span> <ArrowRight />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="lead-step" data-cy="step-year">
          <p className="echo" data-cy="form-echo">{chosen?.echo}</p>
          <div className="field">
            <label className="sr-only" htmlFor={id('year')}>What year is your child in?</label>
            <select id={id('year')} value={form.yearLevel} onChange={pickYear} data-cy="form-year-level">
              <option value="">Choose a year</option>
              {YEAR_LEVELS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button type="button" className="lead-back" onClick={() => go(0)} data-cy="form-back">← Back</button>
        </div>
      )}

      {step === 2 && (
        <form className="lead-step" onSubmit={handleSubmit} data-cy="step-details">
          <div className="field">
            <label htmlFor={id('name')}>Your name</label>
            <input id={id('name')} type="text" autoComplete="given-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-cy="form-name" required />
          </div>
          <div className="field">
            <label htmlFor={id('phone')}>Mobile number</label>
            <input id={id('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="04xx xxx xxx" minLength={8} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-cy="form-phone" required />
          </div>

          {/* Honeypot: hidden from people, irresistible to spam bots. */}
          <input type="text" name="_gotcha" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={gotcha} onChange={(e) => setGotcha(e.target.value)} />

          {error && <p className="form-error" role="alert" data-cy="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting} data-cy="form-submit">
            {submitting ? 'Sending…' : 'Book my free lesson'} {!submitting && <ArrowRight />}
          </button>
          <p className="lead-promise">We call within 24 hours. Free, no contract.</p>
          <button type="button" className="lead-back" onClick={() => go(1)} data-cy="form-back">← Back</button>
        </form>
      )}

      <p className="lead-foot">
        <a href={`tel:${PHONE}`} onClick={() => trackPhone(`form-${location}`)}>{PHONE_DISPLAY}</a>
        {' · '}
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp(`form-${location}`)} data-cy="form-whatsapp">
          <WhatsApp /> WhatsApp
        </a>
      </p>
    </div>
  )
}
