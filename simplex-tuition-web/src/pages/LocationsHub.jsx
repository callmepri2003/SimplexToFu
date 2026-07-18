import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TrustStrip from '../components/sections/TrustStrip'
import HowItWorks from '../components/sections/HowItWorks'
import CallbackForm from '../components/sections/CallbackForm'
import { locations } from '../data/locations'
import { useSeo } from '../hooks/useSeo'
import { ArrowRight, Check, MapPin } from '../components/icons'

const ORIGIN = 'https://simplextuition.com.au'

export default function LocationsHub() {
  const navigate = useNavigate()

  const seo = useMemo(() => ({
    title: 'Maths & English Tutoring in South-West Sydney | Simplex Tuition',
    description: 'In-home maths and English tutoring across south-west Sydney — Austral, Leppington, Edmondson Park, Carnes Hill, Prestons, Liverpool and more. Tutors with a 95+ ATAR. Free trial lesson.',
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

      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> <span>/</span> <span>Tutoring</span>
            </nav>
            <span className="eyebrow">Areas we serve</span>
            <h1>Maths &amp; English tutoring across south-west Sydney</h1>
            <p className="hero-sub">Based in Austral, we bring one-to-one tutoring to families right across the Liverpool area. Same flat rate whether we come to you or you come to us.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#book">Book a free trial lesson <ArrowRight /></a>
              <span className="assurance"><Check /> Free &amp; no obligation</span>
            </div>
          </div>
          <div className="hero-media">
            <div className="photo-slot hero-photo">
              <img src="/hero-tutoring.jpg" alt="A Simplex tutor working with a student in south-west Sydney" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Suburbs we tutor in</span>
            <h2>Find in-home tutoring near you</h2>
            <p>Pick your suburb to see how tutoring works locally. Don't see yours? Call us — we cover the whole south-west.</p>
          </div>
          <div className="loc-grid">
            {locations.map((l) => (
              <Link className="loc-card" to={`/tutoring/${l.slug}`} key={l.slug}>
                <span className="loc-pin"><MapPin /></span>
                <span className="loc-body">
                  <span className="loc-name">{l.name}</span>
                  <span className="loc-sub">Maths &amp; English tutoring &middot; {l.postcode}</span>
                </span>
                <span className="loc-arrow"><ArrowRight /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <CallbackForm pathId="struggling" onSubmitted={() => navigate('/thank-you')} />
      <Footer />
    </>
  )
}
