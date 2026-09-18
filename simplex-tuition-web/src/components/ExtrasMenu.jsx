import { useEffect, useRef, useState } from 'react'
import DistanceDialog from './DistanceDialog'
import { trackEvent } from '../hooks/useAnalytics'
import { Menu } from './icons'

// Quiet menu beside the booking button: page links, plus the extras that are
// there for fun. Nothing in here competes with "Book a free lesson".
export default function ExtrasMenu() {
  const [open, setOpen] = useState(false)
  const [distance, setDistance] = useState(false)
  const wrap = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="extras" ref={wrap}>
      <button type="button" className="extras-btn" aria-expanded={open} aria-haspopup="true" aria-label="More" onClick={() => setOpen(!open)} data-cy="extras-btn">
        <Menu />
      </button>
      {open && (
        <div className="extras-menu" data-cy="extras-menu">
          <a href="#how" onClick={() => setOpen(false)}>How it works</a>
          <a href="#results" onClick={() => setOpen(false)}>Reviews</a>
          <a href="#faq" onClick={() => setOpen(false)}>Questions</a>
          <hr />
          <button type="button" onClick={() => { trackEvent('extras_opened', { item: 'distance' }); setDistance(true); setOpen(false) }} data-cy="extras-distance">
            How far are we? <span>Just for fun</span>
          </button>
        </div>
      )}
      <DistanceDialog open={distance} onClose={() => setDistance(false)} />
    </div>
  )
}
