import { Link } from 'react-router-dom'
import { PHONE, PHONE_DISPLAY } from '../data/content'
import { locations } from '../data/locations'
import { whatsappUrl, trackWhatsApp, trackPhone } from '../utils/contact'

// `minimal` is for a page with one job of its own (the maths skills map asks for an email): who we
// are and how to reach us stay, the suburb links and the booking link go. That page has no #book.
export default function Footer({ minimal = false }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <img className="foot-logo" src="/brand/simplex-logo-horizontal-dark.svg" alt="Simplex Tuition" width="500" height="110" loading="lazy" />
            <p className="foot-tag">Keep them on track.</p>
            <p className="foot-about">One-on-one maths and English tutoring, Kindergarten to Year 12. Based in Austral, NSW.</p>
          </div>
          {!minimal && <div className="foot-col">
            <h4>Areas we tutor</h4>
            <Link to="/tutoring">All areas</Link>
            {locations.map((l) => (
              <Link key={l.slug} to={`/tutoring/${l.slug}`}>{l.name}</Link>
            ))}
          </div>}
          <div className="foot-col">
            <h4>Get in touch</h4>
            <a href={`tel:${PHONE}`} onClick={() => trackPhone('footer')}>{PHONE_DISPLAY}</a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp('footer')}>WhatsApp us</a>
            {!minimal && <a href="#book">Book a free lesson</a>}
            <p>Austral, NSW 2179</p>
          </div>
        </div>
        <div className="foot-bottom">
          <span suppressHydrationWarning>&copy; {new Date().getFullYear()} Simplex Tuition</span>
          <span>All tutors hold a Working With Children Check</span>
        </div>
      </div>
    </footer>
  )
}
