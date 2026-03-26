import { useState, useRef } from 'react'
import styles from './CallbackForm.module.css'
import { paths, defaultPath } from '../../data/pathContent'
import { trackEvent } from '../../hooks/useAnalytics'

const YEAR_LEVELS = [
  'Kindergarten', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12',
]

const TIMES = ['Morning (8am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–8pm)']

export default function CallbackForm({ pathId, onSubmitted }) {
  const content = paths[pathId] ?? defaultPath
  const [form, setForm] = useState({
    name: '', phone: '', yearLevel: '', bestTime: '', notes: '',
  })
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
      const res = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          path: pathId,
          _subject: `New callback request — ${form.name}`,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      trackEvent('form_submitted', { path: pathId, year_level: form.yearLevel, best_time: form.bestTime })
      onSubmitted()
    } catch {
      trackEvent('form_error', { path: pathId })
      setError('Something went wrong. Please try calling directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.section} id="callback-form" data-cy="callback-form">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.header}>
            <div className={styles.label}>Get in touch</div>
            <h2 className={styles.heading}>{content.callbackHeadline}</h2>
            <p className={styles.sub}>{content.callbackSub}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Your name *</label>
              <input className={styles.input} type="text" value={form.name} onChange={set('name')} placeholder="e.g. Sarah Johnson" data-cy="form-name" required />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Phone number *</label>
              <input className={styles.input} type="tel" value={form.phone} onChange={set('phone')} placeholder="e.g. 0412 345 678" data-cy="form-phone" required />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Child's year level *</label>
              <select className={styles.select} value={form.yearLevel} onChange={set('yearLevel')} data-cy="form-year-level" required>
                <option value="">Select year level</option>
                {YEAR_LEVELS.map((y) => (<option key={y} value={y}>{y}</option>))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Best time to call *</label>
              <div className={styles.timeButtons}>
                {TIMES.map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    data-cy={`form-time-btn-${i}`}
                    className={`${styles.timeBtn} ${form.bestTime === t ? styles.timeBtnActive : ''}`}
                    onClick={() => setForm({ ...form, bestTime: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                Anything I should know before I call?
                <span className={styles.optional}> (optional)</span>
              </label>
              <textarea className={styles.textarea} value={form.notes} onChange={set('notes')} placeholder="e.g. She's struggling with fractions and has a test in 3 weeks" data-cy="form-notes" rows={3} />
            </div>

            {error && <div className={styles.error} data-cy="form-error">{error}</div>}

            <button type="submit" className={`btn-primary ${styles.submit}`} data-cy="form-submit" disabled={submitting || !form.bestTime}>
              {submitting ? 'Sending...' : 'Request a callback →'}
            </button>

            <p className={styles.promise}>
              I'll call you within 24 hours. If it's urgent, call me directly:&nbsp;
              <a href="tel:+61452330300" className={styles.phone}>0452 330 300</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
