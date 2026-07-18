import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../components/sections/Hero'
import TrustStrip from '../components/sections/TrustStrip'
import HowItWorks from '../components/sections/HowItWorks'
import Results from '../components/sections/Results'
import WhySimplex from '../components/sections/WhySimplex'
import MeetTutors from '../components/sections/MeetTutors'
import FAQ from '../components/sections/FAQ'
import CallbackForm from '../components/sections/CallbackForm'
import DiagnosticOffer from '../components/sections/DiagnosticOffer'
import { useVisitorPath } from '../hooks/useVisitorPath'

export default function Home() {
  const { path } = useVisitorPath()
  const [submitted, setSubmitted] = useState(false)

  const activePath = path ?? 'struggling'

  return (
    <>
      <Header />
      <Hero pathId={activePath} />
      <TrustStrip />
      <HowItWorks pathId={activePath} />
      <Results />
      <WhySimplex />
      <MeetTutors />
      <FAQ />
      {!submitted ? (
        <CallbackForm pathId={activePath} onSubmitted={() => setSubmitted(true)} />
      ) : (
        <DiagnosticOffer pathId={activePath} />
      )}
      <Footer />
    </>
  )
}
