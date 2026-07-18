import { useNavigate } from 'react-router-dom'
import { trackEvent } from '../../hooks/useAnalytics'
import { ArrowRight } from '../icons'

export default function DiagnosticOffer({ pathId }) {
  const navigate = useNavigate()

  const handleYes = () => {
    trackEvent('diagnostic_started', { path: pathId })
    navigate(`/diagnostic?path=${pathId}`)
  }

  const handleSkip = () => {
    trackEvent('diagnostic_skipped', { path: pathId })
    navigate('/thank-you')
  }

  return (
    <section className="block cta-final" id="book">
      <div className="wrap" style={{ maxWidth: 720, textAlign: 'center' }}>
        <span className="eyebrow" style={{ justifyContent: 'center' }}>You're all set</span>
        <h2 style={{ color: '#fff', marginTop: 16, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>Want to make our first call even more useful?</h2>
        <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 18, margin: '16px auto 30px', maxWidth: '46ch' }}>
          Take the optional 5-minute diagnostic so we know exactly where your child stands before we call. Eight quick questions.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" data-cy="diagnostic-offer-yes" onClick={handleYes}>Take the diagnostic <ArrowRight /></button>
          <button className="btn btn-ghost" data-cy="diagnostic-offer-skip" onClick={handleSkip} style={{ color: '#fff', borderColor: 'rgba(255,255,255,.4)' }}>
            No thanks, just call me
          </button>
        </div>
      </div>
    </section>
  )
}
