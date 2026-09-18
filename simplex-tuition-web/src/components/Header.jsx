import { Link } from 'react-router-dom'
import { PHONE, PHONE_DISPLAY } from '../data/content'
import { trackEvent } from '../hooks/useAnalytics'
import { trackPhone } from '../utils/contact'
import ExtrasMenu from './ExtrasMenu'
import { Phone } from './icons'

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link className="brand" to="/" aria-label="Simplex Tuition home">
          <img src="/brand/simplex-logo-horizontal-light.svg" alt="Simplex Tuition" width="500" height="110" />
        </Link>
        <div className="nav-cta">
          <a className="nav-phone" href={`tel:${PHONE}`} onClick={() => trackPhone('header')}>
            <Phone /><span>{PHONE_DISPLAY}</span>
          </a>
          <a className="btn btn-primary btn-sm" href="#book" onClick={() => trackEvent('cta_clicked', { location: 'header' })}>
            Book a free lesson
          </a>
          <ExtrasMenu />
        </div>
      </div>
    </header>
  )
}
