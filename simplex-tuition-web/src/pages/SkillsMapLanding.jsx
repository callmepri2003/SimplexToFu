import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MapSignup from '../components/MapSignup'
import MapTeaser from '../components/sections/MapTeaser'
import FAQ from '../components/sections/FAQ'
import { Check, Stars } from '../components/icons'
import { GOOGLE_REVIEWS_URL, REVIEWS, REVIEW_COUNT } from '../data/content'
import { MAP_LANDING as COPY } from '../data/skillsChainCopy'
import teaser from '../data/skillsMapTeaser.json'
import { trackEvent } from '../hooks/useAnalytics'
import { useSeo } from '../hooks/useSeo'
import { mapLandingSeo } from '../seo/pages'
import { useMapAccess } from '../hooks/useMapAccess'
import { safeNext } from '../utils/mapAccess'
import '../styles/map-landing.css'

const SEO = mapLandingSeo()
// The review in which a family describes, in their own words, what the map is about.
const GAP_REVIEW = REVIEWS.find((r) => /gaps/i.test(r.quote))
const FIRST_TOPIC = teaser.topics.find((t) => t.chip === 'Algebra') ?? teaser.topics[0]

// Where the content leads: one page, one ask. An email, in exchange for the maths skills map.
//
// Order follows the avatar document: what she gets (both doors) → a taste of it → the trigger
// she recognises (the report comment) → what is on the map → local proof → her questions →
// the ask again. No site navigation, no sticky bar and no booking button: nothing competes
// with the one thing this page is for.
export default function SkillsMapLanding() {
  useSeo(SEO)
  const [params] = useSearchParams()
  const next = safeNext(params.get('next')) // set when the map itself sent them here for an email
  const [topic, setTopic] = useState(FIRST_TOPIC)
  const [picked, setPicked] = useState(false)
  const hasAccess = useMapAccess() // always false while prerendering, so the built page shows the form

  const pick = (t) => { setTopic(t); setPicked(true) }

  return (
    <>
      <Header minimal />
      <main data-cy="map-landing">
        <section className="hero map-hero" id="top">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{COPY.eyebrow}</p>
              <h1 data-cy="hero-headline">{COPY.h1[0]}<span className="hl">{COPY.h1[1]}</span></h1>
              <p className="hero-sub">{COPY.sub}</p>
              <MapSignup location="map-hero" topic={picked ? topic : null} next={next} hasAccess={hasAccess} />
              <ul className="hero-proof">
                <li><Stars /> <strong>5.0</strong> from {REVIEW_COUNT} Google reviews</li>
                {COPY.proof.map((p) => <li key={p}><Check /> {p}</li>)}
              </ul>
            </div>

            {/* One real line of the chain, drawn the way the map draws it. */}
            <figure className="map-line" aria-label="One line of the map">
              <ol>
                {teaser.heroLine.map((s) => (
                  <li key={s.label}><span>{s.stage}</span>{s.label}</li>
                ))}
              </ol>
              <figcaption className="margin-note">{COPY.inside.note}</figcaption>
            </figure>
          </div>
        </section>

        <MapTeaser topic={topic} onPick={pick} hasAccess={hasAccess} />

        <section className="block map-report" data-cy="map-report">
          <div className="wrap report-grid">
            <figure className="note taped report-note">
              <figcaption className="note-label">{COPY.report.label}</figcaption>
              <blockquote>{COPY.report.quote}</blockquote>
            </figure>
            <div className="report-copy">
              <h2>{COPY.report.h2}</h2>
              {COPY.report.body.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
        </section>

        <section className="block map-inside" data-cy="map-inside">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">{COPY.inside.eyebrow}</p>
              <h2>{COPY.inside.h2}</h2>
            </div>
            <div className="map-points">
              {COPY.inside.points.map((p) => (
                <div className="map-point" key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.body(teaser.skills)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {GAP_REVIEW && (
          <section className="block map-proof" data-cy="map-proof">
            <div className="wrap map-proof-wrap">
              <div className="sec-head">
                <p className="eyebrow">{COPY.proofSection.eyebrow}</p>
                <h2>{COPY.proofSection.h2}</h2>
              </div>
              <figure className="review">
                <Stars />
                <blockquote>“{GAP_REVIEW.quote}”</blockquote>
                <figcaption><strong>{GAP_REVIEW.who}</strong><span>{GAP_REVIEW.detail}</span></figcaption>
              </figure>
              <a className="inline-link" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('reviews_clicked', { location: 'map-landing' })}>
                Read all {REVIEW_COUNT} Google reviews
              </a>
            </div>
          </section>
        )}

        <FAQ title={COPY.faqTitle} items={COPY.faqs} />

        <section className="block final" data-cy="map-final">
          <div className="wrap final-grid">
            <div className="final-copy">
              <h2>{COPY.final.h2}</h2>
              <p>{COPY.final.body}</p>
            </div>
            <MapSignup location="map-final" topic={picked ? topic : null} next={next} hasAccess={hasAccess} dark />
          </div>
        </section>
      </main>
      <Footer minimal />
    </>
  )
}
