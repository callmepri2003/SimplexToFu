import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
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
import NotFound from './NotFound'
import { getLocation } from '../data/locations'
import { locationSeo, locationFaqs } from '../seo/pages'
import { useSeo } from '../hooks/useSeo'

function listSchools(schools) {
  if (schools.length === 1) return schools[0]
  return `${schools.slice(0, -1).join(', ')} and ${schools[schools.length - 1]}`
}

// An unknown suburb is a real not-found (404.html in production), not a
// redirect: redirecting made every mistyped URL look like a live page.
export default function LocationPage() {
  const { suburb } = useParams()
  const loc = getLocation(suburb)
  return loc ? <SuburbPage loc={loc} /> : <NotFound />
}

function SuburbPage({ loc }) {
  const seo = useMemo(() => locationSeo(loc), [loc])
  useSeo(seo)

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
        <FAQ title={`Tutoring in ${loc.name}, answered.`} items={locationFaqs(loc)} />
        <FinalCta suburb={loc.name} />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
