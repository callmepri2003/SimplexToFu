import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileBar from '../components/MobileBar'
import Hero from '../components/sections/Hero'
import TheReport from '../components/sections/TheReport'
import TwoDoors from '../components/sections/TwoDoors'
import OneOnOne from '../components/sections/OneOnOne'
import LessonPhotos from '../components/sections/LessonPhotos'
import Reviews from '../components/sections/Reviews'
import Tutors from '../components/sections/Tutors'
import NextSteps from '../components/sections/NextSteps'
import FAQ from '../components/sections/FAQ'
import FinalCta from '../components/sections/FinalCta'
import { FAQS } from '../data/content'

// Section order follows AVATAR_MASTER §10: recognition → keep-them-on-track
// promise → anti-classroom → seen-it-happening photos → local proof →
// tutor credentials & WWCC → free lesson.
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero
          eyebrow="Maths & English · Austral & nearby"
          title={<>One-on-one tutoring that keeps them <span className="hl">on track.</span></>}
          sub="For Kindergarten to Year 12. The same tutor every week, at our Austral space or in your home. No classroom, no rushing. The first lesson is free."
        />
        <TheReport />
        <TwoDoors />
        <OneOnOne />
        <LessonPhotos />
        <Reviews />
        <Tutors />
        <NextSteps />
        <FAQ items={FAQS} />
        <FinalCta />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
