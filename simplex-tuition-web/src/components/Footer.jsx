import { Link } from 'react-router-dom'
import { Logo } from './icons'
import { locations } from '../data/locations'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-brand"><span className="mark"><Logo /></span> Simplex Tuition</div>
            <p className="foot-about">Private one-to-one maths &amp; English tutoring for Kindergarten to Year 12, based in Austral and serving south-west Sydney.</p>
          </div>
          <div className="foot-col">
            <h4>Explore</h4>
            <a href="#how">How it works</a>
            <a href="#results">Results</a>
            <a href="#why">Why Simplex</a>
            <a href="#faq">Questions</a>
          </div>
          <div className="foot-col">
            <h4>Areas we serve</h4>
            <Link to="/tutoring">All areas</Link>
            {locations.slice(0, 6).map((l) => (
              <Link key={l.slug} to={`/tutoring/${l.slug}`}>{l.name}</Link>
            ))}
          </div>
          <div className="foot-col">
            <h4>Get in touch</h4>
            <a href="tel:+61452330300">0452 330 300</a>
            <p>Austral, NSW 2179</p>
            <p>Maths &amp; English &middot; K&ndash;12</p>
            <a href="#book">Book a free trial</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>&copy; 2026 Simplex Tuition. All rights reserved.</span>
          <span>Serving Austral, Leppington, Edmondson Park, Carnes Hill &amp; nearby.</span>
        </div>
      </div>
    </footer>
  )
}
