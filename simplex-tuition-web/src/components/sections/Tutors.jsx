import { TUTOR_POINTS } from '../../data/content'
import { Check } from '../icons'

// Answers the first anticipated objection (avatar §7) in the parent's own words.
export default function Tutors() {
  return (
    <section className="block tutors" data-cy="tutors">
      <div className="wrap">
        <div>
          <p className="eyebrow">Who teaches your child</p>
          <h2>“Is it just some random uni student?” <span className="soft">It's a fair question.</span></h2>
          <ul className="tutor-list">
            {TUTOR_POINTS.map((t) => (
              <li key={t.title}>
                <span className="tick"><Check /></span>
                <div><h3>{t.title}</h3><p>{t.body}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
