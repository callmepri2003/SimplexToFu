import LeadForm from '../LeadForm'

export default function FinalCta({ suburb, heading = 'Book the free lesson. See how they go.' }) {
  return (
    <section className="block final" id="book" data-cy="final-cta">
      <div className="wrap final-grid">
        <div className="final-copy">
          <h2>{heading}</h2>
          <p>One hour with a tutor, at our Austral space or in your home. No cost, no contract, nothing to decide until afterwards.</p>
          <ul className="final-list">
            <li>We call you back within 24 hours</li>
            <li>One tutor, one child, the whole lesson</li>
            <li>The same tutor every week if you continue</li>
          </ul>
        </div>
        <LeadForm location={suburb ? 'suburb-final' : 'final'} suburb={suburb} label="Book a free lesson" dark />
      </div>
    </section>
  )
}
