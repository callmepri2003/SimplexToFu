import { Plus } from '../icons'

const QAS = [
  { q: 'What subjects and year levels do you cover?', a: <>Maths and English, from Kindergarten right through to Year 12, including selective and HSC preparation. Lessons are always one-to-one and matched to your child's stage.</> },
  { q: 'Where do lessons happen?', a: <>We're based in Austral and work with families across the surrounding south-west Sydney suburbs. When you book your free trial we'll confirm the format that suits you.</> },
  { q: 'Is the trial lesson really free?', a: <>Yes. The first lesson is free and there's no obligation to continue. It's how we find your child's gaps and how you decide if we're the right fit. No contracts, ever.</> },
  { q: 'How soon will we see results?', a: <>Every child is different, but because we target the exact concepts holding them back, most parents notice more confidence within a few weeks, and marks follow. Marcus went from 37% to 76% in Advanced Maths in a single term.</> },
  { q: "What if it doesn't work for my child?", a: <>That's exactly what the free trial is for. You'll see how your child responds before spending anything, and because there are no contracts you're never locked in. If it's not the right fit, there's no cost and no hard feelings.</> },
  { q: 'Can we pause or cancel anytime?', a: <>Yes, always. No lock-in contracts and no joining fees. Pause over exams or holidays, or stop whenever you need to. Just let us know and we'll sort it out.</> },
  { q: 'How much does it cost?', a: <><strong>$70 per hour</strong>, a flat rate from Kindergarten to Year 12. Enrolling siblings? Each child is <strong>$10 off per hour</strong>. No contracts, no joining fees, and the first trial lesson is always free.</> },
]

export default function FAQ() {
  return (
    <section className="block" id="faq" style={{ background: 'var(--cream-2)', borderTop: '1px solid var(--border)' }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Questions</span>
          <h2>The things parents ask first</h2>
        </div>
        <div className="faq">
          {QAS.map((item, i) => (
            <details className="qa" key={i} open={i === 0}>
              <summary>{item.q}<span className="ic"><Plus /></span></summary>
              <div className="ans">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
