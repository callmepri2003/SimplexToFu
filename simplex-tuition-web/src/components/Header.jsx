import { Link } from 'react-router-dom'
import { PHONE, PHONE_DISPLAY } from '../data/content'
import { trackEvent } from '../hooks/useAnalytics'
import { trackPhone } from '../utils/contact'
import { Phone } from './icons'

// `minimal` is for a page with one job of its own (the maths skills map asks for an email): the
// logo stays, the phone and booking button go, so nothing competes with that page's one ask.
export default function Header({ minimal = false }) {
  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link className="brand" to="/" aria-label="Simplex Tuition home">
          <img src="/brand/simplex-logo-horizontal-light.svg" alt="Simplex Tuition" width="500" height="110" />
        </Link>
        {!minimal && <div className="nav-cta">
          <a className="nav-phone" href={`tel:${PHONE}`} onClick={() => trackPhone('header')}>
            <Phone /><span>{PHONE_DISPLAY}</span>
          </a>
          <a className="btn btn-primary btn-sm" href="#book" onClick={() => trackEvent('cta_clicked', { location: 'header' })}>
            Book a free lesson
          </a>
        </div>}
      </div>
    </header>
  )
}
