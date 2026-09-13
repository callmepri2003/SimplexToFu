import { REVIEW_COUNT } from '../../data/content'
import LeadForm from '../LeadForm'
import { Check, Stars } from '../icons'

// Headline is a plain claim for the solution-aware parent arriving from
// "tutoring near me"; the report-card scene below does the recognition work
// for the problem-aware parent arriving from an ad.
export default function Hero({ eyebrow, title, sub, crumbs, suburb, formLocation = 'hero' }) {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          {crumbs}
          <p className="eyebrow">{eyebrow}</p>
          <h1 data-cy="hero-headline">{title}</h1>
          <p className="hero-sub">{sub}</p>
          <ul className="hero-proof">
            <li><Stars /> <strong>5.0</strong> from {REVIEW_COUNT} Google reviews</li>
            <li><Check /> Same tutor every week</li>
            <li><Check /> Every tutor holds a WWCC</li>
          </ul>
        </div>
        <div className="hero-form">
          <LeadForm location={formLocation} suburb={suburb} />
        </div>
      </div>
    </section>
  )
}
