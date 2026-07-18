import { Check, CircleCheck, Zap } from '../icons'

const ITEMS = [
  { t: 'A plan for your child, not a syllabus', p: 'Every student starts with a diagnostic. Lessons target their gaps, not whatever the textbook says next.' },
  { t: 'They understand it, not just memorise it', p: 'We teach the "why" behind every method so it sticks long after the test is over.' },
  { t: 'Progress you can actually see', p: 'You\'ll know what improved and what\'s next, with no vague "they\'re doing fine" updates.' },
]

export default function WhySimplex() {
  return (
    <section className="block" id="why">
      <div className="wrap why-grid">
        <div className="why-intro">
          <span className="eyebrow">Why Simplex</span>
          <h2>Tutoring that fixes the cause, not the symptom</h2>
          <p>Most tutoring hands kids more of the same worksheets. We find the one concept that's actually blocking them, then rebuild from there.</p>
          <div className="why-list">
            {ITEMS.map((it, i) => (
              <div className="why-item" key={i}>
                <span className="why-check"><Check /></span>
                <div><h3>{it.t}</h3><p>{it.p}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="why-visual">
          <div className="plan-title">Marcus's learning plan</div>
          <div className="plan-sub">Advanced Maths &middot; 37% &rarr; 76%</div>
          <div className="plan-row">
            <span className="pi"><Check /></span>
            <div><div className="pt">Algebraic fractions</div><div className="ps">Root cause of dropped marks</div></div>
            <span className="chk"><CircleCheck /></span>
          </div>
          <div className="plan-row">
            <span className="pi"><Check /></span>
            <div><div className="pt">Quadratic graphing</div><div className="ps">Rebuilt from first principles</div></div>
            <span className="chk"><CircleCheck /></span>
          </div>
          <div className="plan-row">
            <span className="pi"><Zap /></span>
            <div><div className="pt">Exam technique &amp; timing</div><div className="ps">In progress, Term 2</div></div>
          </div>
        </div>
      </div>
    </section>
  )
}
