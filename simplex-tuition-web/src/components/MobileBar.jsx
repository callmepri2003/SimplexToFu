import { useEffect, useState } from 'react'
import { trackEvent } from '../hooks/useAnalytics'
import { whatsappUrl, trackWhatsApp } from '../utils/contact'
import { WhatsApp } from './icons'

// Phone-only sticky bar. Appears once the hero form has scrolled away and hides
// again whenever a form is on screen, so it never covers the thing it points to.
export default function MobileBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const forms = document.querySelectorAll('.lead-form')
    if (!forms.length || typeof IntersectionObserver === 'undefined') return
    const visible = new Set()
    let pastTop = false
    const update = () => setShow(pastTop && visible.size === 0)

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)))
      update()
    })
    forms.forEach((f) => io.observe(f))

    const onScroll = () => {
      pastTop = window.scrollY > 480
      update()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className={`mobile-bar${show ? ' show' : ''}`} data-cy="mobile-bar" aria-hidden={!show}>
      <a className="btn btn-primary" href="#book" tabIndex={show ? 0 : -1} onClick={() => trackEvent('cta_clicked', { location: 'mobile-bar' })}>
        Book a free lesson
      </a>
      <a className="btn btn-wa" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1} onClick={() => trackWhatsApp('mobile-bar')} aria-label="WhatsApp us">
        <WhatsApp /> <span>WhatsApp</span>
      </a>
    </div>
  )
}
