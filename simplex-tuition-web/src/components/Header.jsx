import { useEffect, useState } from 'react'
import { Logo, Phone } from './icons'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap nav">
        <a className="brand" href="#top">
          <span className="mark" aria-hidden="true"><Logo /></span>
          <span>Simplex <small>Tuition</small></span>
        </a>
        <nav className="nav-links">
          <a href="#how">How it works</a>
          <a href="#results">Results</a>
          <a href="#why">Why Simplex</a>
          <a href="#faq">Questions</a>
        </nav>
        <div className="nav-cta">
          <a className="nav-phone" href="tel:+61452330300"><Phone /><span className="nav-phone-label">0452 330 300</span></a>
          <a className="btn btn-primary" href="#book">Book a free trial</a>
        </div>
      </div>
    </header>
  )
}
