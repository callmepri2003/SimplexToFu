import { REVIEWS, REVIEW_COUNT, GOOGLE_REVIEWS_URL } from '../../data/content'
import { trackEvent } from '../../hooks/useAnalytics'
import { Stars } from '../icons'

// She buys on trust but refers on results (avatar §6): lead with the specific
// numbers parents repeat at the school gate, then the reviews themselves.
export default function Reviews() {
  return (
    <section className="block reviews" id="results" data-cy="reviews">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">From local families</p>
          <h2>What parents tell other parents.</h2>
        </div>

        <div className="stat-row">
          <div className="stat"><span className="big">37% → 76%</span><span className="lbl">Advanced Maths, from a Google review</span></div>
          <div className="stat"><span className="big">93%</span><span className="lbl">Latest HSC Advanced Maths exam, after a hard prelim year</span></div>
          <div className="stat"><span className="big">5.0 ★</span><span className="lbl">Across all {REVIEW_COUNT} Google reviews</span></div>
        </div>

        <div className="review-grid">
          {REVIEWS.map((r) => (
            <figure className="review" key={r.who}>
              <Stars />
              <blockquote>“{r.quote}”</blockquote>
              <figcaption><strong>{r.who}</strong><span>{r.detail}</span></figcaption>
            </figure>
          ))}
        </div>

        <p className="reviews-link">
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('reviews_clicked')}>
            Read all {REVIEW_COUNT} reviews on Google →
          </a>
        </p>
      </div>
    </section>
  )
}
