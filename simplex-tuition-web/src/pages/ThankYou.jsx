import { Link, useLocation } from 'react-router-dom'
import { PHONE, PHONE_DISPLAY } from '../data/content'
import { GROUNDWORK } from '../data/groundworkCopy'
import { whatsappUrl, trackWhatsApp, trackPhone } from '../utils/contact'
import { WhatsApp } from '../components/icons'
import { thankYouSeo } from '../seo/pages'
import { useSeo } from '../hooks/useSeo'

const SEO = thankYouSeo()

export default function ThankYou() {
  useSeo(SEO)
  // A lead from the maths skills chain asked for a diagnostic, not the free lesson.
  const state = useLocation().state
  const diagnostic = state?.offer === 'diagnostic'
  // A booking from the Groundwork page: the free one-hour maths check.
  const groundwork = state?.offer === 'groundwork'
  const child = state?.child?.trim() || 'your child'
  const atCentre = state?.where === 'centre'
  const slot = state?.slot || ''
  const address = state?.address?.trim() || ''

  return (
    <main className="thanks" data-cy="thank-you-page">
      <div className="note taped thanks-card">
        <img className="thanks-logo" src="/brand/simplex-logo-horizontal-light.svg" alt="Simplex Tuition" width="500" height="110" />
        {groundwork
          ? <h1>{child}’s diagnostic is <span className="hl">booked.</span></h1>
          : <h1>Thanks. We'll call you <span className="hl">within 24 hours.</span></h1>}
        {groundwork
          ? <>
              <p className="thanks-when" data-cy="thank-you-when">When: <strong>{slot || 'the time you picked'}</strong></p>
              <p className="thanks-where" data-cy="thank-you-where">
                {atCentre
                  ? <>Where: <strong>{GROUNDWORK.book.steps.when.centreCard.title}</strong></>
                  : <>Where: <strong>{address || 'your home'}</strong>. The tutor comes to you.</>}
              </p>
              <p>Bring the school report if you have one. On the day, have your phone ready to watch the results. If you need to change the time, message us.</p>
            </>
          : diagnostic
            ? <p>We'll ask a few questions about your child, then find a time for their maths diagnostic.</p>
            : <p>We'll ask a few questions about your child, then find a time for their free one-hour lesson, at our Austral space or in your home.</p>}
        <p className="thanks-save">Save our number so you know it's us: <a href={`tel:${PHONE}`} onClick={() => trackPhone('thank-you')}>{PHONE_DISPLAY}</a></p>
        <div className="thanks-actions">
          <a className="btn btn-wa" href={whatsappUrl(groundwork ? 'Hi Simplex, I just booked the free maths diagnostic on your website.' : diagnostic ? "Hi Simplex, I just asked for a maths diagnostic on your website." : "Hi Simplex, I just booked a free lesson on your website.")} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp('thank-you')}>
            <WhatsApp /> Can't wait? WhatsApp us
          </a>
          <Link to="/" className="thanks-back">Back to home</Link>
        </div>
      </div>
    </main>
  )
}
