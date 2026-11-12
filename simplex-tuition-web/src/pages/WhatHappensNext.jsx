import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FAQ from '../components/sections/FAQ'
import { ArrowRight, Check, WhatsApp } from '../components/icons'
import { PHONE, PHONE_DISPLAY } from '../data/content'
import { CHAIN_IDS, EXAMPLE_IDS, NEXT as COPY, skill } from '../data/whatHappensNextCopy'
import { trackEvent, trackViewContent } from '../hooks/useAnalytics'
import { useSeo } from '../hooks/useSeo'
import { whatHappensNextSeo } from '../seo/pages'
import { whatsappUrl, trackWhatsApp, trackPhone } from '../utils/contact'
import '../styles/groundwork.css'
import '../styles/what-happens-next.css'

const SEO = whatHappensNextSeo()
const CHAIN = CHAIN_IDS.map(skill)
const EXAMPLES = EXAMPLE_IDS.map(skill)

// The page a parent reaches from the instant form's "See how it works" button. She has already
// seen the form's thank-you and given her number, so this page explains Groundwork from top to
// bottom and asks for nothing: no form, no booking button, one quiet WhatsApp line at the end.
// Minimal header and footer so nothing competes with the reading (§14 pattern).
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

  return (
    <>
      <Header minimal />
      <main className="nx" data-cy="what-happens-next-page">

        <section className="hero nx-hero" id="top" data-cy="nx-hero">
          <div className="wrap">
            <p className="eyebrow">{COPY.hero.eyebrow}</p>
            <h1 data-cy="hero-headline">{COPY.hero.h1[0]}<span className="hl">{COPY.hero.h1[1]}</span></h1>
            <p className="hero-sub">{COPY.hero.sub}</p>
            <p className="nx-note">{COPY.hero.note}</p>
          </div>
        </section>

        <section className="block nx-years" data-cy="nx-years">
          <div className="wrap">
            <div className="nx-two">
              <div>
                <p className="eyebrow">{COPY.years.eyebrow}</p>
                <h2>{COPY.years.h2}</h2>
                {COPY.years.body.map((p) => <p key={p}>{p}</p>)}
              </div>
              <figure className="nx-clip">
                <video ref={clip} src="/video/follow-the-line.mp4" poster="/video/follow-the-line-poster.jpg" autoPlay muted loop playsInline preload="metadata" aria-label={COPY.years.videoLabel} data-cy="nx-clip" />
                <figcaption>{COPY.years.caption}</figcaption>
              </figure>
            </div>
            <h3 className="nx-sub">{COPY.years.chainTitle}</h3>
            <ol className="nx-chain" data-cy="nx-chain">
              {CHAIN.map((s, i) => (
                <li key={s.id} className={`nx-chain-item${i === CHAIN.length - 1 ? ' seen' : ''}`}>
                  <small>{s.band}{i === CHAIN.length - 1 ? ' · what the teacher sees' : i === 0 ? ' · where it broke' : ''}</small>
                  <strong>{s.name}</strong>
                  <span>{s.can}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="block nx-map" data-cy="nx-map">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">{COPY.map.eyebrow}</p>
              <h2>{COPY.map.h2}</h2>
              {COPY.map.body.map((p) => <p key={p}>{p}</p>)}
            </div>
            <h3 className="nx-sub">{COPY.map.exampleTitle}</h3>
            <div className="nx-skills" data-cy="nx-skills">
              {EXAMPLES.map((s) => (
                <article className="nx-skill" key={s.id}>
                  <small>{s.band}</small>
                  <h4>{s.name}</h4>
                  <p>{s.can}</p>
                  <p className="nx-why"><strong>{COPY.map.whyLabel}:</strong> {s.why}</p>
                </article>
              ))}
            </div>
            <Link className="inline-link nx-link" to={COPY.map.link.to} onClick={() => trackEvent('cta_clicked', { location: 'next-map' })}>
              {COPY.map.link.label} <ArrowRight />
            </Link>
          </div>
        </section>

        <section className="block nx-diag" data-cy="nx-diagnostic">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">{COPY.diagnostic.eyebrow}</p>
              <h2>{COPY.diagnostic.h2}</h2>
            </div>
            <ol className="nx-steps">
              {COPY.diagnostic.steps.map((s, i) => (
                <li key={s.title}>
                  <span className="step-num" aria-hidden="true">{i + 1}</span>
                  <div><h3>{s.title}</h3><p>{s.body}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="block nx-program" data-cy="nx-program">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">{COPY.program.eyebrow}</p>
              <h2>{COPY.program.h2}</h2>
              <p>{COPY.program.intro}</p>
            </div>
            <ol className="nx-parts" data-cy="nx-parts">
              {COPY.program.parts.map((p, i) => (
                <li key={p.title}>
                  <span className="nx-part-num" aria-hidden="true">{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ol>
            <p className="nx-after">{COPY.program.after}</p>
          </div>
        </section>

        <section className="block nx-between" data-cy="nx-between">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">{COPY.between.eyebrow}</p>
              <h2>{COPY.between.h2}</h2>
            </div>
            <div className="nx-cards">
              {COPY.between.items.map((it) => (
                <div className="nx-card" key={it.title}><h3>{it.title}</h3><p>{it.body}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="block nx-parent" data-cy="nx-parent">
          <div className="wrap nx-two">
            <div>
              <p className="eyebrow">{COPY.parent.eyebrow}</p>
              <h2>{COPY.parent.h2}</h2>
            </div>
            <ul className="nx-list">
              {COPY.parent.items.map((it) => <li key={it}><Check /> <span>{it}</span></li>)}
            </ul>
          </div>
        </section>

        <section className="block nx-not" data-cy="nx-not">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">{COPY.not.eyebrow}</p>
              <h2>{COPY.not.h2}</h2>
            </div>
            <div className="nx-cards nx-cards-4">
              {COPY.not.items.map((it) => (
                <div className="nx-card" key={it.title}><h3>{it.title}</h3><p>{it.body}</p></div>
              ))}
            </div>
          </div>
        </section>

        <FAQ title={COPY.faqTitle} items={COPY.faqs} />

        <section className="block final nx-final" data-cy="nx-final">
          <div className="wrap nx-final-wrap">
            <h2>{COPY.final.h2}</h2>
            <p>{COPY.final.body}</p>
            <div className="nx-actions">
              <a className="btn btn-wa" href={whatsappUrl(COPY.final.whatsappText)} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp('next-final')} data-cy="nx-whatsapp">
                <WhatsApp /> {COPY.final.whatsapp}
              </a>
              <span className="nx-call">{COPY.final.callLabel} <a href={`tel:${PHONE}`} onClick={() => trackPhone('next-final')} data-cy="nx-phone">{PHONE_DISPLAY}</a></span>
            </div>
          </div>
        </section>

      </main>
      <Footer minimal />
    </>
  )
}
