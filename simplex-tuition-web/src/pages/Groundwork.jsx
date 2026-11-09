import Header from '../components/Header'
import Footer from '../components/Footer'
import FAQ from '../components/sections/FAQ'
import GroundworkBooking from '../components/GroundworkBooking'
import { Stars } from '../components/icons'
import { REVIEWS, REVIEW_COUNT } from '../data/content'
import { GROUNDWORK as COPY } from '../data/groundworkCopy'
import { trackEvent } from '../hooks/useAnalytics'
import { useSeo } from '../hooks/useSeo'
import { groundworkSeo } from '../seo/pages'
import '../styles/groundwork.css'

const SEO = groundworkSeo()
// The two reviews a fix-door parent reads twice: the one about finding gaps, the one about a
// child who did not want to go and now looks forward to it. Public Google reviews only.
const PROOF = [REVIEWS.find((r) => /gaps/i.test(r.quote)), REVIEWS.find((r) => /first day/i.test(r.quote))].filter(Boolean)

// Where the direct-offer ad lands. Order: say it plainly, show the video, one CTA. Then the
// nurture: what happens in the hour, the Jaden story and chain, local proof, her questions.
// The form is last and the CTA repeats after every section, so scrolling past is reading, not
// refusing. No price anywhere (decision 0003: price is said in the room).
export default function Groundwork() {
  useSeo(SEO)
  const cta = (location) => () => trackEvent('cta_clicked', { location })

  return (
    <>
      <Header minimal />
      <main className="gw" data-cy="groundwork-page">

        <section className="hero gw-hero" id="top" data-cy="gw-hero">
          <div className="wrap gw-hero-grid">
            <div className="gw-hero-copy">
              <p className="eyebrow">{COPY.hero.eyebrow}</p>
              <h1 data-cy="hero-headline">{COPY.hero.h1[0]}<span className="hl">{COPY.hero.h1[1]}</span>{COPY.hero.h1[2]}</h1>
              <p className="hero-sub">{COPY.hero.sub}</p>
              <div className="gw-cta-row">
                <a className="btn btn-primary" href="#book" onClick={cta('gw-hero')} data-cy="gw-cta-hero">{COPY.hero.cta}</a>
                <span className="gw-cta-note">{COPY.hero.ctaNote}</span>
              </div>
            </div>
            {/* What a parent sees on her phone during the hour: the map, with the gaps in red. The play
                button is for the 90-second video; until it is cut, this card is the poster frame. */}
            <figure className="gw-preview" data-cy="gw-video">
              <div className="gw-preview-map" role="img" aria-label="A skills map with green ticks for skills a child has and red crosses for gaps">
                {COPY.hero.video.rows.map((r) => (
                  <div className="gw-preview-row" key={r.band}>
                    <span className="gw-preview-band">{r.band}</span>
                    <span className="gw-preview-skills">
                      {r.skills.map((s, i) => <i key={i} className={`gw-preview-skill ${s}`} />)}
                    </span>
                  </div>
                ))}
                <button type="button" className="gw-play" aria-label={`${COPY.hero.video.title}, ${COPY.hero.video.note}`} onClick={() => trackEvent('video_clicked', { location: 'gw-hero' })}>
                  <span aria-hidden="true">▶</span>
                </button>
              </div>
              <figcaption>
                <strong>{COPY.hero.video.title}</strong>
                <span>{COPY.hero.video.note} · {COPY.hero.video.caption}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="block gw-hour" data-cy="gw-hour">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">{COPY.hour.eyebrow}</p>
              <h2>{COPY.hour.h2}</h2>
            </div>
            <ol className="gw-steps">
              {COPY.hour.steps.map((s, i) => (
                <li className="gw-step-item" key={s.title}>
                  <span className="step-num" aria-hidden="true">{i + 1}</span>
                  <div><h3>{s.title}</h3><p>{s.body}</p></div>
                </li>
              ))}
            </ol>
            <div className="gw-cta-row">
              <a className="btn btn-primary" href="#book" onClick={cta('gw-hour')}>{COPY.hero.cta}</a>
              <span className="gw-cta-note">{COPY.hour.ctaNote}</span>
            </div>
          </div>
        </section>

        <section className="block gw-story" data-cy="gw-story">
          <div className="wrap">
            <div className="gw-story-grid">
              <figure className="note taped gw-report">
                <figcaption className="note-label">{COPY.story.noteLabel}</figcaption>
                <blockquote>{COPY.story.quote}</blockquote>
              </figure>
              <div className="gw-story-copy">
                <h2>{COPY.story.h2}</h2>
                <p>{COPY.story.body}</p>
              </div>
            </div>
            <ol className="gw-chain" aria-label="Jaden’s fractions chain">
              {COPY.story.chain.map((n, i) => (
                <li key={n.label} className={`gw-node ${n.state}`}>
                  {i > 0 && <span className={`gw-link${n.state === 'gap' ? ' broken' : ''}`} aria-hidden="true" />}
                  <span className="gw-node-box"><small>{n.band}</small>{n.label}</span>
                </li>
              ))}
            </ol>
            <p className="margin-note gw-margin">{COPY.story.marginNote}</p>
            <div className="gw-cta-row">
              <a className="btn btn-primary" href="#book" onClick={cta('gw-story')}>{COPY.story.cta}</a>
            </div>
          </div>
        </section>

        <section className="block gw-proof" data-cy="gw-proof">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">{COPY.proof.eyebrow}</p>
              <h2>{COPY.proof.h2}</h2>
            </div>
            <div className="gw-reviews">
              {PROOF.map((r) => (
                <figure className="review" key={r.quote}>
                  <Stars />
                  <blockquote>“{r.quote}”</blockquote>
                  <figcaption><strong>{r.who}</strong><span>{r.detail}</span></figcaption>
                </figure>
              ))}
            </div>
            <div className="gw-cta-row">
              <a className="btn btn-primary" href="#book" onClick={cta('gw-proof')}>{COPY.hero.cta}</a>
              <span className="gw-cta-note">{COPY.proof.ctaNote(REVIEW_COUNT)}</span>
            </div>
          </div>
        </section>

        <FAQ title={COPY.faqTitle} items={COPY.faqs} />

        <section className="block final gw-final" id="book" data-cy="gw-book">
          <div className="wrap gw-final-wrap">
            <div className="gw-final-head">
              <h2>{COPY.book.h2}</h2>
              <p>{COPY.book.sub}</p>
            </div>
            <GroundworkBooking location="groundwork" />
            <p className="gw-privacy">{COPY.book.privacy}</p>
          </div>
        </section>

      </main>
      <Footer minimal />
    </>
  )
}
