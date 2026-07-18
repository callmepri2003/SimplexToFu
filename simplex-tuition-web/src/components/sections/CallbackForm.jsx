import { useState, useRef } from 'react'
import { paths, defaultPath } from '../../data/pathContent'
import { trackEvent, trackLead } from '../../hooks/useAnalytics'
import { getAttribution } from '../../utils/attribution'
import { Check, Phone, ArrowRight, Shield } from '../icons'

const YEAR_LEVELS = [
  'Kindergarten', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12',
]

const TIMES = ['Morning (8am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–8pm)']

export default function CallbackForm({ pathId, onSubmitted }) {
  const content = paths[pathId] ?? defaultPath
  const [form, setForm] = useState({ name: '', phone: '', yearLevel: '', bestTime: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const hasTrackedStart = useRef(false)

  const set = (field) => (e) => {
    if (!hasTrackedStart.current) {
      trackEvent('form_started', { path: pathId })
      hasTrackedStart.current = true
    }
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const attribution = getAttribution()
      const res = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          path: pathId,
          ...attribution,
          _subject: `New callback request — ${form.name}`,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      trackLead({ path: pathId, year_level: form.yearLevel, best_time: form.bestTime, ...attribution })
      onSubmitted()
    } catch {
      trackEvent('form_error', { path: pathId })
      setError('Something went wrong. Please try calling directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="block cta-final" id="book" data-cy="callback-form">
      <div className="wrap cta-grid">
        <div className="cta-copy">
          <span className="eyebrow">Book a free trial</span>
          <h2>{content.callbackHeadline}</h2>
          <p>{content.callbackSub}</p>
          <div className="cta-assure">
            <div className="a"><Check /> Free first lesson, no obligation to continue</div>
            <div className="a"><Check /> A real person calls you, never a call centre</div>
            <div className="a"><Check /> No contracts and no pressure</div>
            <div className="a"><Check /> $70/hour flat, siblings save $10/hour each</div>
          </div>
          <div className="cta-phone"><Phone /> Prefer to talk now? <a href="tel:+61452330300">0452 330 300</a></div>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <h3>Book your free trial</h3>
            <p className="sub">Tell us when suits and we'll confirm within 24 hours. Takes about 30 seconds.</p>

            <div className="field">
              <label>Your name *</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="e.g. Sarah Johnson" data-cy="form-name" required />
            </div>

            <div className="field">
              <label>Phone number *</label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="e.g. 0412 345 678" data-cy="form-phone" required />
            </div>

            <div className="field">
              <label>Child's year level *</label>
              <select value={form.yearLevel} onChange={set('yearLevel')} data-cy="form-year-level" required>
                <option value="">Select year level</option>
                {YEAR_LEVELS.map((y) => (<option key={y} value={y}>{y}</option>))}
              </select>
            </div>

            <div className="field">
              <label>Best time to call *</label>
              <div className="time-btns">
                {TIMES.map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    data-cy={`form-time-btn-${i}`}
                    className={form.bestTime === t ? 'on' : ''}
                    onClick={() => setForm({ ...form, bestTime: t })}
                  >
                    {t.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Anything I should know? (optional)</label>
              <textarea value={form.notes} onChange={set('notes')} placeholder="e.g. struggling with fractions, test in 3 weeks" data-cy="form-notes" rows={3} />
            </div>

            {error && <div className="form-error" data-cy="form-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-block" data-cy="form-submit" disabled={submitting || !form.bestTime}>
              {submitting ? 'Sending...' : 'Book my free trial'} <ArrowRight />
            </button>

            <p className="form-note"><Shield /> We'll call within 24 hours. Or call now:&nbsp;<a href="tel:+61452330300">0452 330 300</a></p>
          </form>
        </div>
      </div>
    </section>
  )
}
