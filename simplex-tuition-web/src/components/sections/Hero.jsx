import { paths, defaultPath } from '../../data/pathContent'
import { trackEvent } from '../../hooks/useAnalytics'
import { ArrowRight, Check, MapPin, Book, Cap, Camera, Stars } from '../icons'

export default function Hero({ pathId }) {
  const content = paths[pathId] ?? defaultPath

  const scrollToForm = () => {
    trackEvent('hero_cta_clicked', { path: pathId })
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">Private tutoring in Austral, Sydney</span>
          <h1 data-cy="hero-headline">{content.heroHeadline}</h1>
          <p className="hero-sub" data-cy="hero-sub">{content.heroSub}</p>
          <div className="hero-actions">
            <button className="btn btn-primary" data-cy="hero-cta" onClick={scrollToForm}>{content.heroCTA} <ArrowRight /></button>
            <span className="assurance"><Check /> Free &amp; no obligation</span>
          </div>
          <div className="hero-trust">
            <span className="item"><MapPin /> Austral &amp; nearby suburbs</span>
            <span className="dot"></span>
            <span className="item"><Book /> Maths &amp; English</span>
            <span className="dot"></span>
            <span className="item"><Cap /> K&ndash;12</span>
          </div>
        </div>

        <div className="hero-media">
          <div className="photo-slot hero-photo">
            <div className="ph-inner">
              <Camera />
              <div className="t">Hero photo goes here</div>
              <div className="d">A tutor and student mid-lesson, warm and natural</div>
            </div>
          </div>
          <div className="result-float">
            <Stars />
            <div className="rf-metric">
              <span className="rf-from">37%</span>
              <span className="rf-arrow"><ArrowRight /></span>
              <span className="rf-to">76%</span>
            </div>
            <div className="rf-label">Advanced Maths &middot; verified Google review</div>
          </div>
        </div>
      </div>
    </section>
  )
}
