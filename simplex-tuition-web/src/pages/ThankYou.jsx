import { Link } from 'react-router-dom'
import { PHONE, PHONE_DISPLAY } from '../data/content'
import { whatsappUrl, trackWhatsApp, trackPhone } from '../utils/contact'
import { WhatsApp } from '../components/icons'

export default function ThankYou() {
  return (
    <main className="thanks" data-cy="thank-you-page">
      <div className="note taped thanks-card">
        <img className="thanks-logo" src="/brand/simplex-logo-horizontal-light.svg" alt="Simplex Tuition" width="500" height="110" />
        <h1>Thanks. We'll call you <span className="hl">within 24 hours.</span></h1>
        <p>We'll ask a few questions about your child, then find a time for their free one-hour lesson, at our Austral space or in your home.</p>
        <p className="thanks-save">Save our number so you know it's us: <a href={`tel:${PHONE}`} onClick={() => trackPhone('thank-you')}>{PHONE_DISPLAY}</a></p>
        <div className="thanks-actions">
          <a className="btn btn-wa" href={whatsappUrl("Hi Simplex, I just booked a free lesson on your website.")} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp('thank-you')}>
            <WhatsApp /> Can't wait? WhatsApp us
          </a>
          <Link to="/" className="thanks-back">Back to home</Link>
        </div>
      </div>
    </main>
  )
}
