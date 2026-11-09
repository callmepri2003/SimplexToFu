import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PHONE, PHONE_DISPLAY } from '../data/content'
import { GROUNDWORK as COPY } from '../data/groundworkCopy'
import { trackEvent, trackLead } from '../hooks/useAnalytics'
import { getAttribution } from '../utils/attribution'
import { buildEnquiry, bookSlot } from '../utils/enquiries'
import { whatsappUrl, trackWhatsApp, trackPhone } from '../utils/contact'
import { bookableDays, slotLabel } from '../utils/slots'
import { ArrowRight, WhatsApp } from './icons'

const STEPS = 5
const OFFER = { id: 'groundwork', subject: 'New Groundwork diagnostic booking' }

// Slots already booked, from the Apps Script (integrations/enquiries-sheet, doGet). Best-effort:
// if it is not configured or fails, every slot shows and the calendar event is still created on
// submit, so the worst case is a clash Pri sees in his calendar and rings about.
async function fetchTakenSlots() {
  const url = import.meta.env.VITE_BOOKINGS_URL
  if (!url) return []
  try {
    const res = await fetch(url, { method: 'GET' })
    const data = await res.json()
    return Array.isArray(data?.taken) ? data.taken : []
  } catch {
    return []
  }
}

// One question at a time, lowest commitment first (the child's year is a tap), the calendar
// last. The parent picks her own day and time: nothing is confirmed by phone or text afterwards.
// The booking lands in three places: Formspree (email + archive), the Enquiries tab (channel
// attribution, Trial Date) and Pri's Google Calendar, all via the same Apps Script hand-off.
export default function GroundworkBooking({ location = 'groundwork' }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ year: '', child: '', parent: '', phone: '', email: '', where: 'home', address: '' })
  const [days, setDays] = useState(() => bookableDays())
  const [dayKey, setDayKey] = useState(null)
  const [slot, setSlot] = useState(null)
  const [gotcha, setGotcha] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const started = useRef(false)
  const B = COPY.book

  // Grey out what is already booked, once the parent reaches the calendar.
  useEffect(() => {
    if (step !== 5) return
    let live = true
    fetchTakenSlots().then((taken) => { if (live && taken.length) setDays(bookableDays({ taken })) })
    return () => { live = false }
  }, [step])

  const markStarted = () => {
    if (started.current) return
    started.current = true
    trackEvent('form_started', { location })
  }
  const set = (field, value) => {
    markStarted()
    setForm((f) => ({ ...f, [field]: value }))
  }
  const go = (n) => {
    setStep(n)
    trackEvent('form_step', { location, step: n })
  }
  const next = (e) => {
    e.preventDefault()
    go(Math.min(step + 1, STEPS))
  }
  const back = () => go(Math.max(step - 1, 1))

  const day = days.find((d) => d.key === dayKey) || days.find((d) => d.open > 0) || days[0]
  const chosen = slot && day ? slotLabel(day, slot) : ''

  // The slot went to someone else between drawing the calendar and submitting: say so, redraw, let her pick again.
  const slotGone = (taken) => {
    setDays(bookableDays({ taken }))
    setSlot(null)
    setError(B.slotTaken)
    setSubmitting(false)
    trackEvent('slot_taken', { location })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!slot) return
    setSubmitting(true)
    setError(null)
    const atHome = form.where === 'home'
    const where = atHome ? 'In our home' : 'At the Austral space'
    const concern = `Groundwork diagnostic · ${chosen} · ${where}${atHome && form.address ? ` (${form.address})` : ''}`
    try {
      const attribution = getAttribution()

      // 1. Re-check the calendar right before booking: catches a slot taken while she was typing.
      const taken = await fetchTakenSlots()
      if (taken.some((t) => new Date(t).getTime() === new Date(slot.start).getTime())) return slotGone(taken)

      // 2. Take the slot. The script checks again inside its lock, so a tie is refused, not doubled.
      if (!gotcha) {
        const booked = await bookSlot({
          ...buildEnquiry({ form: { name: `${form.parent} (${form.child})`, phone: form.phone, yearLevel: form.year }, concern, location, attribution }),
          slotStart: slot.start,
          slotLabel: chosen,
          where,
          address: atHome ? form.address : '',
          child: form.child,
          email: form.email,
        })
        if (booked && !booked.ok && booked.error === 'slot_taken') return slotGone([...taken, slot.start])
      }

      // 3. The email + archive copy, as every other form on the site.
      const res = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.parent,
          child: form.child,
          phone: form.phone,
          email: form.email,
          yearLevel: form.year,
          where,
          address: atHome ? form.address : '',
          slot_start: slot.start,
          slot_label: chosen,
          offer: OFFER.id,
          form_location: location,
          ...attribution,
          _gotcha: gotcha,
          _subject: `${OFFER.subject} — ${chosen} · ${form.parent} for ${form.child} (${form.year}) · ${where}`,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      trackLead({ location, year_level: form.year, offer: OFFER.id, channel: attribution.channel, channel_detail: attribution.channel_detail })
      navigate('/thank-you', { state: { offer: OFFER.id, child: form.child, where: form.where, address: form.address, slot: chosen } })
    } catch {
      trackEvent('form_error', { location })
      setError(B.error)
      setSubmitting(false)
    }
  }

  const childName = form.child.trim() || 'your child'
  const pct = Math.round((step / STEPS) * 100)

  return (
    <div className="gw-book-card" data-cy="groundwork-booking">
      <div className="gw-progress" aria-hidden="true">
        <div className="gw-progress-label"><span>Step {step} of {STEPS}</span><span>{B.notes[step]}</span></div>
        <div className="gw-progress-bar"><div className="gw-progress-fill" style={{ width: `${pct}%` }} /></div>
      </div>
      <p className="sr-only" aria-live="polite">Step {step} of {STEPS}</p>

      {step === 1 && (
        <form className="gw-step" onSubmit={next} data-cy="gw-step-year">
          <h3 className="gw-q">{B.steps.year.q}</h3>
          <div className="gw-chips" role="group" aria-label={B.steps.year.q}>
            {COPY.years.map((y) => (
              <button key={y} type="button" className={`gw-chip${form.year === y ? ' on' : ''}`} aria-pressed={form.year === y} onClick={() => set('year', y)} data-cy={`gw-year-${y.replace(' ', '-').toLowerCase()}`}>{y}</button>
            ))}
          </div>
          <div className="gw-nav">
            <span />
            <button type="submit" className="btn btn-primary" disabled={!form.year} data-cy="gw-next">{B.next} <ArrowRight /></button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form className="gw-step" onSubmit={next} data-cy="gw-step-child">
          <h3 className="gw-q">{B.steps.child.q}</h3>
          <p className="gw-note">{B.steps.child.note}</p>
          <div className="field">
            <label htmlFor="gw-child">{B.steps.child.label}</label>
            <input id="gw-child" type="text" autoComplete="off" value={form.child} onChange={(e) => set('child', e.target.value)} required autoFocus data-cy="gw-child" />
          </div>
          <div className="gw-nav">
            <button type="button" className="gw-back" onClick={back}>← {B.back}</button>
            <button type="submit" className="btn btn-primary" data-cy="gw-next">{B.next} <ArrowRight /></button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form className="gw-step" onSubmit={next} data-cy="gw-step-parent">
          <h3 className="gw-q">{B.steps.parent.q}</h3>
          <div className="field">
            <label htmlFor="gw-parent">{B.steps.parent.label}</label>
            <input id="gw-parent" type="text" autoComplete="given-name" value={form.parent} onChange={(e) => set('parent', e.target.value)} required autoFocus data-cy="gw-parent" />
          </div>
          <div className="gw-nav">
            <button type="button" className="gw-back" onClick={back}>← {B.back}</button>
            <button type="submit" className="btn btn-primary" data-cy="gw-next">{B.next} <ArrowRight /></button>
          </div>
        </form>
      )}

      {step === 4 && (
        <form className="gw-step" onSubmit={next} data-cy="gw-step-contact">
          <h3 className="gw-q">{B.steps.contact.q}</h3>
          <div className="field">
            <label htmlFor="gw-phone">{B.steps.contact.phone}</label>
            <input id="gw-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="04xx xxx xxx" minLength={8} value={form.phone} onChange={(e) => set('phone', e.target.value)} required autoFocus data-cy="gw-phone" />
          </div>
          <div className="field">
            <label htmlFor="gw-email">{B.steps.contact.email} <span className="optional">{B.steps.contact.optional}</span></label>
            <input id="gw-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} data-cy="gw-email" />
          </div>
          <div className="gw-nav">
            <button type="button" className="gw-back" onClick={back}>← {B.back}</button>
            <button type="submit" className="btn btn-primary" data-cy="gw-next">{B.next} <ArrowRight /></button>
          </div>
        </form>
      )}

      {step === 5 && (
        <form className="gw-step" onSubmit={handleSubmit} data-cy="gw-step-when">
          <h3 className="gw-q">{B.steps.when.q}</h3>
          <div className="gw-where" role="group" aria-label={B.steps.when.q}>
            <button type="button" className={`gw-opt${form.where === 'home' ? ' on' : ''}`} aria-pressed={form.where === 'home'} onClick={() => set('where', 'home')} data-cy="gw-where-home">
              <strong>{B.steps.when.home.title}</strong><small>{B.steps.when.home.note}</small>
            </button>
            <button type="button" className={`gw-opt${form.where === 'centre' ? ' on' : ''}`} aria-pressed={form.where === 'centre'} onClick={() => set('where', 'centre')} data-cy="gw-where-centre">
              <strong>{B.steps.when.centre.title}</strong><small>{B.steps.when.centre.note}</small>
            </button>
          </div>
          {form.where === 'home' ? (
            <div className="field">
              <label htmlFor="gw-address">{B.steps.when.address.label}</label>
              <input id="gw-address" type="text" autoComplete="street-address" placeholder={B.steps.when.address.placeholder} value={form.address} onChange={(e) => set('address', e.target.value)} required data-cy="gw-address" />
            </div>
          ) : (
            <div className="gw-centre" data-cy="gw-centre-address">
              <strong>{B.steps.when.centreCard.title}</strong>
              <span>{B.steps.when.centreCard.note}</span>
            </div>
          )}

          <h3 className="gw-q gw-q-sm">{B.steps.when.dayQ}</h3>
          <div className="gw-days" role="group" aria-label={B.steps.when.dayQ} data-cy="gw-days">
            {days.map((d) => (
              <button
                key={d.key}
                type="button"
                className={`gw-day${d.key === day?.key ? ' on' : ''}${d.open === 0 ? ' full' : ''}`}
                aria-pressed={d.key === day?.key}
                disabled={d.open === 0}
                onClick={() => { markStarted(); setDayKey(d.key); setSlot(null) }}
                data-cy={`gw-day-${d.key}`}
              >
                <small>{d.weekday}</small><strong>{d.dayNum}</strong><small>{d.month}</small>
              </button>
            ))}
          </div>

          {day && (
            <>
              <h3 className="gw-q gw-q-sm">{B.steps.when.timeQ(childName, day.label)}</h3>
              <div className="gw-chips gw-times" role="group" aria-label={B.steps.when.timeQ(childName, day.label)}>
                {day.slots.map((s) => (
                  <button
                    key={s.start}
                    type="button"
                    className={`gw-chip${slot?.start === s.start ? ' on' : ''}${s.taken ? ' taken' : ''}`}
                    aria-pressed={slot?.start === s.start}
                    disabled={s.taken}
                    onClick={() => { markStarted(); setSlot(s) }}
                    data-cy="gw-time"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}
          <p className="gw-note">{B.steps.when.timeNote}</p>

          {/* Honeypot: hidden from people, irresistible to spam bots. */}
          <input type="text" name="_gotcha" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={gotcha} onChange={(e) => setGotcha(e.target.value)} />

          {error && <p className="form-error" role="alert" data-cy="form-error">{error}</p>}

          <div className="gw-nav">
            <button type="button" className="gw-back" onClick={back}>← {B.back}</button>
            <button type="submit" className="btn btn-primary" disabled={submitting || !slot} data-cy="gw-submit">
              {submitting ? B.submitting : chosen ? B.submitFor(chosen) : B.submit} {!submitting && <ArrowRight />}
            </button>
          </div>
        </form>
      )}

      <p className="gw-foot">
        {B.foot}{' '}
        <a href={whatsappUrl(COPY.whatsapp)} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp(`form-${location}`)} data-cy="form-whatsapp">
          <WhatsApp /> {PHONE_DISPLAY}
        </a>
        {' '}or call <a href={`tel:${PHONE}`} onClick={() => trackPhone(`form-${location}`)}>{PHONE_DISPLAY}</a>.
      </p>
    </div>
  )
}
