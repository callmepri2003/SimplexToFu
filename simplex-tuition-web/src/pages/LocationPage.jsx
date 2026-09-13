import { useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileBar from '../components/MobileBar'
import Hero from '../components/sections/Hero'
import TwoDoors from '../components/sections/TwoDoors'
import OneOnOne from '../components/sections/OneOnOne'
import LessonPhotos from '../components/sections/LessonPhotos'
import Reviews from '../components/sections/Reviews'
import Tutors from '../components/sections/Tutors'
import NextSteps from '../components/sections/NextSteps'
import FAQ from '../components/sections/FAQ'
import FinalCta from '../components/sections/FinalCta'
import { getLocation } from '../data/locations'
import { FAQS, PHONE, PHONE_DISPLAY, REVIEW_COUNT } from '../data/content'
import { useSeo } from '../hooks/useSeo'

const ORIGIN = 'https://simplextuition.com.au'

function listSchools(schools) {
  if (schools.length === 1) return schools[0]
  return `${schools.slice(0, -1).join(', ')} and ${schools[schools.length - 1]}`
}

const SHARED_FAQ_QUESTIONS = ['How much does it cost?', 'Is it really one-on-one?', 'Is the first lesson really free?', 'Will my child feel pushed?']

function buildFaqs(loc) {
  return [loc.faq, ...FAQS.filter((f) => SHARED_FAQ_QUESTIONS.includes(f.q))]
}

export default function LocationPage() {
  const { suburb } = useParams()
  const loc = getLocation(suburb)

  const seo = useMemo(() => {
    if (!loc) return {}
    const canonical = `${ORIGIN}/tutoring/${loc.slug}`
    const faqs = buildFaqs(loc)
    return {
      title: `Maths & English Tutoring in ${loc.name} | Simplex Tuition`,
      description: `One-on-one maths and English tutoring in ${loc.name} (${loc.postcode}), Kindergarten to Year 12. Same tutor every week, at our Austral space or in your home. Free first lesson — call ${PHONE_DISPLAY}.`,
      canonical,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': ['LocalBusiness', 'EducationalOrganization'],
            '@id': `${canonical}#business`,
            name: 'Simplex Tuition',
            url: canonical,
            telephone: PHONE,
            image: `${ORIGIN}/brand/end-card-1920x1080.png`,
            address: { '@type': 'PostalAddress', addressLocality: 'Austral', addressRegion: 'NSW', postalCode: '2179', addressCountry: 'AU' },
            areaServed: { '@type': 'Place', name: `${loc.name}, NSW ${loc.postcode}` },
            aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: String(REVIEW_COUNT) },
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

  return (
    <>
      <Header />
      <main>
        <Hero
          crumbs={(
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> <span>/</span> <Link to="/tutoring">Tutoring</Link> <span>/</span> <span>{loc.name}</span>
            </nav>
          )}
          eyebrow={`Tutoring in ${loc.name} ${loc.postcode}`}
          title={<>Maths &amp; English tutoring in <span className="hl">{loc.name}</span></>}
          sub={loc.lede}
          suburb={loc.name}
          formLocation="suburb-hero"
        />

        <section className="block local" data-cy="local-note">
          <div className="wrap local-wrap">
            <p className="eyebrow">For {loc.name} families</p>
            <h2>Local, one-on-one, and the same tutor every week.</h2>
            <p>{loc.localNote}</p>
            <p>We tutor students from schools across {loc.name} and nearby, including {listSchools(loc.schools)}. Every student starts with a free one-hour lesson. After that, it's the same tutor at the same time each week, at our Austral space or in your home.</p>
          </div>
        </section>

        <TwoDoors />
        <OneOnOne />
        <LessonPhotos />
        <Reviews />
        <Tutors />
        <NextSteps />
        <FAQ title={`Tutoring in ${loc.name}, answered.`} items={buildFaqs(loc)} />
        <FinalCta suburb={loc.name} />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
