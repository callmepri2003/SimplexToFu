import { useState } from 'react'
import WelcomeModal from '../components/WelcomeModal'
import Hero from '../components/sections/Hero'
import HowItWorks from '../components/sections/HowItWorks'
import ProofSection from '../components/sections/ProofSection'
import CallbackForm from '../components/sections/CallbackForm'
import DiagnosticOffer from '../components/sections/DiagnosticOffer'
import { useVisitorPath } from '../hooks/useVisitorPath'

export default function Home() {
  const { path, modalSeen, savePath } = useVisitorPath()
  const [submitted, setSubmitted] = useState(false)

  const activePath = path ?? 'struggling'

  return (
    <>
      {!modalSeen && (
        <WelcomeModal onComplete={savePath} />
      )}
      <Hero pathId={activePath} />
      <HowItWorks pathId={activePath} />
      <ProofSection />
      {!submitted ? (
        <CallbackForm pathId={activePath} onSubmitted={() => setSubmitted(true)} />
      ) : (
        <DiagnosticOffer pathId={activePath} />
      )}
    </>
  )
}
