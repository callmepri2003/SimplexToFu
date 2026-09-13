import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileBar from '../components/MobileBar'
import Hero from '../components/sections/Hero'
import NextSteps from '../components/sections/NextSteps'
import FinalCta from '../components/sections/FinalCta'
import { locations } from '../data/locations'
import { PHONE, PHONE_DISPLAY } from '../data/content'
import { useSeo } from '../hooks/useSeo'
import { trackPhone } from '../utils/contact'
import { ArrowRight } from '../components/icons'

const ORIGIN = 'https://simplextuition.com.au'

export default function LocationsHub() {
  const seo = useMemo(() => ({
    title: 'Maths & English Tutoring in South-West Sydney | Simplex Tuition',
    description: 'One-on-one maths and English tutoring across south-west Sydney: Austral, Leppington, Edmondson Park, Carnes Hill, Prestons, Liverpool and more. At our Austral space or in your home. Free first lesson.',
    canonical: `${ORIGIN}/tutoring`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
            { '@type': 'ListItem', position: 2, name: 'Tutoring', item: `${ORIGIN}/tutoring` },
          ],
        },
        {
          '@type': 'ItemList',
          itemListElement: locations.map((l, i) => ({
            '@type': 'ListItem', position: i + 1, name: `Tutoring in ${l.name}`, url: `${ORIGIN}/tutoring/${l.slug}`,
          })),
        },
      ],
    },
  }), [])

  useSeo(seo)

  return (
    <>
      <Header />
      <main>
        <Hero
          crumbs={(
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> <span>/</span> <span>Tutoring</span>
            </nav>
          )}
          eyebrow="Areas we tutor"
          title={<>One-on-one tutoring across <span className="hl">south-west Sydney</span></>}
          sub="Our tutoring space is in Austral, and we also tutor in family homes across the surrounding suburbs. Same tutor every week, wherever the lesson happens."
          formLocation="hub-hero"
        />

        <section className="block" data-cy="suburb-list">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">Suburbs</p>
              <h2>Find tutoring near you.</h2>
              <p>
                Don't see your suburb? Call <a className="inline-link" href={`tel:${PHONE}`} onClick={() => trackPhone('hub')}>{PHONE_DISPLAY}</a> and ask. If we can get to you, we will.
              </p>
            </div>
            <div className="loc-grid">
              {locations.map((l) => (
                <Link className="loc-card" to={`/tutoring/${l.slug}`} key={l.slug}>
                  <span>
                    <span className="loc-name">{l.name}</span>
                    <span className="loc-sub">Maths &amp; English · {l.postcode}</span>
                  </span>
                  <ArrowRight />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <NextSteps />
        <FinalCta />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
