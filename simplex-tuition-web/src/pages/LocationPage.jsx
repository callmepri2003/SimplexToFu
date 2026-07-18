import { useMemo } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TrustStrip from '../components/sections/TrustStrip'
import HowItWorks from '../components/sections/HowItWorks'
import Results from '../components/sections/Results'
import WhySimplex from '../components/sections/WhySimplex'
import CallbackForm from '../components/sections/CallbackForm'
import { getLocation } from '../data/locations'
import { useSeo } from '../hooks/useSeo'
import { ArrowRight, Check, MapPin, Book, Cap, Stars, Plus } from '../components/icons'

const ORIGIN = 'https://simplextuition.com.au'

function listSchools(schools) {
  if (schools.length === 1) return schools[0]
  return `${schools.slice(0, -1).join(', ')} and ${schools[schools.length - 1]}`
}

function buildFaqs(loc) {
  return [
    loc.faq,
    { q: 'How much does tutoring cost?', a: '$70 per hour, a flat rate from Kindergarten to Year 12, and siblings are $10 off per hour each. No contracts or joining fees, and the first trial lesson is free.' },
    { q: 'What year levels and subjects do you cover?', a: 'Maths and English from Kindergarten to Year 12, including selective, OC and HSC preparation. Every tutor scored a 95+ ATAR.' },
  ]
}

export default function LocationPage() {
  const { suburb } = useParams()
  const navigate = useNavigate()
  const loc = getLocation(suburb)

  const seo = useMemo(() => {
    if (!loc) return {}
    const canonical = `${ORIGIN}/tutoring/${loc.slug}`
    const faqs = buildFaqs(loc)
    return {
      title: `Maths & English Tutoring in ${loc.name} | Simplex Tuition`,
      description: `In-home maths and English tutoring in ${loc.name} (${loc.postcode}), Kindergarten to Year 12. Tutors with a 95+ ATAR, personalised to your child's gaps. Free trial lesson — call 0452 330 300.`,
      canonical,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': ['LocalBusiness', 'EducationalOrganization'],
            '@id': `${canonical}#business`,
            name: 'Simplex Tuition',
            url: canonical,
            telephone: '+61452330300',
            priceRange: '$$',
            image: `${ORIGIN}/hero-tutoring.jpg`,
            address: { '@type': 'PostalAddress', addressLocality: 'Austral', addressRegion: 'NSW', postalCode: '2179', addressCountry: 'AU' },
            areaServed: { '@type': 'Place', name: `${loc.name}, NSW ${loc.postcode}` },
            aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: '13' },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
              { '@type': 'ListItem', position: 2, name: 'Tutoring', item: `${ORIGIN}/tutoring` },
              { '@type': 'ListItem', position: 3, name: loc.name, item: canonical },
            ],
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          },
        ],
      },
    }
  }, [loc])

  useSeo(seo)

  if (!loc) return <Navigate to="/tutoring" replace />

  const faqs = buildFaqs(loc)

  return (
    <>
      <Header />

      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> <span>/</span> <Link to="/tutoring">Tutoring</Link> <span>/</span> <span>{loc.name}</span>
            </nav>
            <span className="eyebrow">In-home tutoring in {loc.name}</span>
            <h1>Maths &amp; English tutoring in {loc.name}</h1>
            <p className="hero-sub">{loc.lede}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#book">Book a free trial lesson <ArrowRight /></a>
              <span className="assurance"><Check /> Free &amp; no obligation</span>
            </div>
            <div className="hero-trust">
              <span className="item"><MapPin /> {loc.name} &amp; nearby</span>
              <span className="dot"></span>
              <span className="item"><Book /> Maths &amp; English</span>
              <span className="dot"></span>
              <span className="item"><Cap /> K&ndash;12</span>
            </div>
          </div>

          <div className="hero-media">
            <div className="photo-slot hero-photo">
              <img src="/hero-tutoring.jpg" alt={`A Simplex tutor helping a ${loc.name} student with their work`} loading="eager" />
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

      <TrustStrip />

      <section className="block">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <span className="eyebrow">Local tutoring</span>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}>Maths &amp; English tutors for {loc.name} families</h2>
          <p style={{ color: 'var(--muted)', fontSize: 18, marginTop: 18, lineHeight: 1.7 }}>{loc.localNote}</p>
          <p style={{ color: 'var(--muted)', fontSize: 18, marginTop: 16, lineHeight: 1.7 }}>
            We tutor students from schools across {loc.name} and nearby, including {listSchools(loc.schools)}. Every student starts with a free trial lesson so we can pinpoint exactly where they're stuck, then a plan built around those gaps, taught one-to-one by a tutor who scored a 95+ ATAR. We come to your home in {loc.name} or you come to us in Austral, for the same flat rate.
          </p>
        </div>
      </section>

      <HowItWorks />
      <Results />
      <WhySimplex />

      <section className="block" id="faq" style={{ background: 'var(--cream-2)', borderTop: '1px solid var(--border)' }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Questions</span>
            <h2>Tutoring in {loc.name}, answered</h2>
          </div>
          <div className="faq">
            {faqs.map((f, i) => (
              <details className="qa" key={i} open={i === 0}>
                <summary>{f.q}<span className="ic"><Plus /></span></summary>
                <div className="ans">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CallbackForm pathId="struggling" onSubmitted={() => navigate('/thank-you')} />
      <Footer />
    </>
  )
}
