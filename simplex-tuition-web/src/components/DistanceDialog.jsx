import { useEffect, useRef, useState } from 'react'
import { SUBURBS } from '../data/geo'
import { distanceKm, describeDistance } from '../utils/distance'
import { trackEvent } from '../hooks/useAnalytics'
import { ArrowRight } from './icons'

// "How far are we?" — proximity is what decides it for most families, so this
// answers the question in one tap instead of making them open Maps.
export default function DistanceDialog({ open, onClose }) {
  const ref = useRef(null)
  const [result, setResult] = useState(null)
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  const pickSuburb = (e) => {
    const suburb = SUBURBS.find((s) => s.name === e.target.value)
    if (!suburb) return setResult(null)
    trackEvent('distance_checked', { method: 'suburb', suburb: suburb.name })
    setResult({ from: suburb.name, ...describeDistance(distanceKm(suburb)) })
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setResult({ from: 'your location', line: "Your browser won't share a location. Pick your suburb instead." })
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const km = distanceKm({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        trackEvent('distance_checked', { method: 'geolocation' })
        setResult({ from: 'where you are now', ...describeDistance(km) })
        setLocating(false)
      },
      () => {
        setResult({ from: 'your location', line: 'No location this time. Pick your suburb below instead.' })
        setLocating(false)
      },
      { timeout: 8000 }
    )
  }

  return (
    <dialog className="sheet" ref={ref} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose() }} data-cy="distance-dialog">
      <div className="sheet-body">
        <p className="eyebrow">Just for fun</p>
        <h2>How far are we?</h2>
        <p className="sheet-sub">Our tutoring space is in Austral. Most of our families are a few minutes away.</p>

        <div className="sheet-controls">
          <label htmlFor="distance-suburb">Your suburb</label>
          <select id="distance-suburb" onChange={pickSuburb} defaultValue="" data-cy="distance-suburb">
            <option value="">Choose your suburb</option>
            {SUBURBS.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          <button type="button" className="btn btn-quiet" onClick={useMyLocation} disabled={locating} data-cy="distance-locate">
            {locating ? 'Finding you…' : 'Or use my location'}
          </button>
        </div>

        {result && (
          <div className="sheet-result" role="status" data-cy="distance-result">
            <p className="result-line">{result.line}</p>
            <p className="result-note">Straight-line distance from {result.from} — the road is always a bit longer.</p>
            <a className="btn btn-primary" href="#book" onClick={() => { trackEvent('cta_clicked', { location: 'distance-dialog' }); onClose() }}>
              Book a free lesson <ArrowRight />
            </a>
          </div>
        )}

        <button type="button" className="sheet-close" onClick={onClose} aria-label="Close">Close</button>
      </div>
    </dialog>
  )
}
