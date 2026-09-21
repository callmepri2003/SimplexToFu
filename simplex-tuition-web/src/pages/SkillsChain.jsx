import { useCallback, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LeadForm from '../components/LeadForm'
import { trackEvent } from '../hooks/useAnalytics'
import { useSeo } from '../hooks/useSeo'
import { chainSeo } from '../seo/pages'
import { getChainFallback } from '../chain/fallbackStore'
import { CHAIN_BOOK, CHAIN_COPY, DIAGNOSTIC_OFFER } from '../data/skillsChainCopy'
import '../chain/page.css'

const SEO = chainSeo()

// The maths skills chain: all of school maths as one chain, for a parent on a phone.
//
// The chain sells nothing. It shows a parent how many earlier skills sit under the one
// their child is stuck on, and leaves "which one is it?" open. The form underneath is
// the page's single call to action, which is why there is no MobileBar here: a second,
// sticky one would also sit on top of the chain's own dock.
export default function SkillsChain() {
  useSeo(SEO)
  const page = useRef(null)
  const booking = useRef(null)
  const [Island, setIsland] = useState(null)
  const [focus, setFocus] = useState(null) // the skill whose chain the parent has lit up
  const [year, setYear] = useState('')
  const [atForm, setAtForm] = useState(false)

  // The chain measures the screen, so it only ever runs in the browser. Until it arrives the
  // prerendered list below stands in for it.
  useEffect(() => {
    let live = true
    import('../chain/ChainIsland').then((m) => { if (live) setIsland(() => m.default) })
    return () => { live = false }
  }, [])

  // The chain pins its year strip under the site header, so it needs the header's height.
  useEffect(() => {
    const header = document.querySelector('.site-header')
    if (!header || typeof ResizeObserver === 'undefined') return undefined
    const set = () => page.current?.style.setProperty('--pv-offset', `${header.offsetHeight}px`)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(header)
    return () => ro.disconnect()
  }, [])

  // The chain's dock is fixed to the bottom of the phone, so it steps aside for the form. But only once the
  // form has properly arrived (its top has climbed past the middle of the screen). The form sits directly
  // under the last skill of a narrowed chain, and the dock there holds the way back to the full chain: if
  // the form's top edge merely peeking in were enough, that way back would vanish.
  useEffect(() => {
    if (!booking.current || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([entry]) => setAtForm(entry.isIntersecting), { rootMargin: '0px 0px -45% 0px' })
    io.observe(booking.current)
    return () => io.disconnect()
  }, [])

  const onEvent = useCallback((name, params) => {
    trackEvent(name, params)
    if (name === 'chain_year') setYear(params.year === 'K' ? 'Kindergarten' : `Year ${params.year}`)
  }, [])

  return (
    <>
      <Header />
      <main ref={page} className={`chain-page${atForm ? ' chain-page--booking' : ''}`} data-cy="skills-chain">
        {Island
          ? <Island onEvent={onEvent} onFocus={setFocus} />
          : (
            <div className="chain-static">
              <h1>{CHAIN_COPY.title}</h1>
              <p>{CHAIN_COPY.lead}</p>
              {/* Filled in at build time only. In the browser this is an empty string, and React
                  leaves the prerendered HTML in place until the chain replaces this whole block. */}
              <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: getChainFallback() }} />
            </div>
          )}

        <section className="block final" id="book" ref={booking} data-cy="chain-book">
          <div className="wrap final-grid">
            <div className="final-copy">
              <h2>{CHAIN_BOOK.heading}</h2>
              <p>{CHAIN_BOOK.body}</p>
            </div>
            <LeadForm location="skills-chain" dark offer={DIAGNOSTIC_OFFER} context={{ stuckOn: focus?.topic ?? '', earlierSkills: focus?.earlierSkills ?? null, year }} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
