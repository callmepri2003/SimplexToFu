import { useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FAQ from '../components/sections/FAQ'
import { Check, WhatsApp } from '../components/icons'
import { PHONE, PHONE_DISPLAY } from '../data/content'
import { NEXT as COPY } from '../data/whatHappensNextCopy'
import { trackViewContent } from '../hooks/useAnalytics'
import { useSeo } from '../hooks/useSeo'
import { whatHappensNextSeo } from '../seo/pages'
import { whatsappUrl, trackWhatsApp, trackPhone } from '../utils/contact'
import '../styles/groundwork.css'
import '../styles/what-happens-next.css'

const SEO = whatHappensNextSeo()

// Where a parent lands after the Meta instant form (its thank-you screen's "See how it works"
// button). She has given her number already, so there is no form and no booking button:
// what happens next, what the hour is, her questions, and WhatsApp for the parent who would
// rather sort the time out now. Header and footer are minimal so nothing competes (§14 pattern).
export default function WhatHappensNext() {
  useSeo(SEO)
  const clip = useRef(null)

  useEffect(() => {
    // The pixel's standard "looked at the offer" event, so Meta can build an audience of leads
    // who kept reading, separate from the PageView every page fires.
    trackViewContent({ content_name: 'what-happens-next', content_category: 'free-maths-diagnostic' })
    // The clip loops silently; a parent who asked for less motion gets its poster frame instead.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) clip.current?.pause()
  }, [])

  const wa = whatsappUrl(COPY.hero.whatsappText)

  return (
    <>
      <Header minimal />
      <main className="nx" data-cy="what-happens-next-page">

        <section className="hero nx-hero" id="top" data-cy="nx-hero">
          <div className="wrap">
            <p className="eyebrow">{COPY.hero.eyebrow}</p>
            <h1 data-cy="hero-headline">{COPY.hero.h1[0]}<span className="hl">{COPY.hero.h1[1]}</span></h1>
            <p className="hero-sub">{COPY.hero.sub}</p>
            <div className="nx-actions">
              <a className="btn btn-wa" href={wa} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp('next-hero')} data-cy="nx-whatsapp">
                <WhatsApp /> {COPY.hero.whatsapp}
              </a>
              <span className="nx-call">{COPY.hero.callLabel} <a href={`tel:${PHONE}`} onClick={() => trackPhone('next-hero')} data-cy="nx-phone">{PHONE_DISPLAY}</a></span>
            </div>
          </div>
        </section>

        <section className="block nx-why" data-cy="nx-why">
          <div className="wrap nx-why-grid">
            <div className="nx-why-copy">
              <p className="eyebrow">{COPY.why.eyebrow}</p>
              <h2>{COPY.why.h2}</h2>
              {COPY.why.body.map((p) => <p key={p}>{p}</p>)}
            </div>
            <figure className="nx-clip">
              <video
                ref={clip}
                src="/video/follow-the-line.mp4"
                poster="/video/follow-the-line-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={COPY.why.videoLabel}
                data-cy="nx-clip"
              />
              <figcaption>{COPY.why.caption}</figcaption>
            </figure>
          </div>
        </section>

        <section className="block nx-hour" data-cy="nx-hour">
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
          </div>
        </section>

        <FAQ title={COPY.faqTitle} items={COPY.faqs} />

        <section className="block final nx-final" data-cy="nx-final">
          <div className="wrap nx-final-grid">
            <div className="nx-final-copy">
              <h2>{COPY.final.h2}</h2>
              <p>{COPY.final.body}</p>
              <div className="nx-actions">
                <a className="btn btn-wa" href={wa} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp('next-final')} data-cy="nx-whatsapp-final">
                  <WhatsApp /> {COPY.hero.whatsapp}
                </a>
                <span className="nx-call">{COPY.hero.callLabel} <a href={`tel:${PHONE}`} onClick={() => trackPhone('next-final')}>{PHONE_DISPLAY}</a></span>
              </div>
            </div>
            <aside className="nx-ready" data-cy="nx-ready">
              <h3>{COPY.final.readyTitle}</h3>
              <ul>
                {COPY.final.ready.map((r) => <li key={r}><Check /> <span>{r}</span></li>)}
              </ul>
              <p className="nx-where">{COPY.final.where}</p>
            </aside>
          </div>
        </section>

      </main>
      <Footer minimal />
    </>
  )
}
