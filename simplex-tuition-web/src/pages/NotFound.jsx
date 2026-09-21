import { Link } from 'react-router-dom'
import { PHONE, PHONE_DISPLAY } from '../data/content'
import { notFoundSeo } from '../seo/pages'
import { useSeo } from '../hooks/useSeo'
import { trackPhone } from '../utils/contact'

const SEO = notFoundSeo()

// Prerendered to dist/404.html, which Vercel serves with a real 404 status for
// any URL that isn't a built page.
export default function NotFound() {
  useSeo(SEO)

  return (
    <main className="thanks" data-cy="not-found-page">
      <div className="note taped thanks-card">
        <img className="thanks-logo" src="/brand/simplex-logo-horizontal-light.svg" alt="Simplex Tuition" width="500" height="110" />
        <h1>We can't find <span className="hl">that page.</span></h1>
        <p>It may have moved, or the link might be wrong. Everything about our tutoring is on the home page.</p>
        <p className="thanks-save">Or call us: <a href={`tel:${PHONE}`} onClick={() => trackPhone('not-found')}>{PHONE_DISPLAY}</a></p>
        <div className="thanks-actions">
          <Link to="/" className="btn btn-primary">Go to the home page</Link>
          <Link to="/tutoring" className="thanks-back">See the suburbs we tutor in</Link>
        </div>
      </div>
    </main>
  )
}
