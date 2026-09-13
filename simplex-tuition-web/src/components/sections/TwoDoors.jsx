import { DOORS } from '../../data/content'
import { trackEvent } from '../../hooks/useAnalytics'
import { ArrowRight } from '../icons'

// One fear, two doors (avatar §2): fix what's slipping, or protect what's fine.
// Both resolve to the same promise so neither parent feels mis-sold.
export default function TwoDoors() {
  return (
    <section className="block doors" data-cy="two-doors">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">Which one sounds like you?</p>
          <h2>Families usually come to us through one of two doors.</h2>
        </div>
        <div className="door-grid">
          {DOORS.map((d, i) => (
            <article className="door" key={d.tag}>
              <span className="door-num">{i + 1}</span>
              <p className="door-tag">{d.tag}</p>
              <h3>{d.title}</h3>
              <p>{d.body}</p>
            </article>
          ))}
        </div>
        <div className="doors-close">
          <p>Either way, the job is the same: <strong>keep them on track.</strong></p>
          <a className="btn btn-primary" href="#book" onClick={() => trackEvent('cta_clicked', { location: 'doors' })}>
            Book a free lesson <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  )
}
