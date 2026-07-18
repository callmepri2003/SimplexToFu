import { ClipboardCheck, Pen, Trending } from '../icons'

const STEPS = [
  { n: '01', Icon: ClipboardCheck, t: 'A free trial lesson', p: "We meet your child, find their exact gaps, and show you what's really going on, at no cost." },
  { n: '02', Icon: Pen, t: 'A plan built around them', p: 'A learning plan targeting their specific weak spots, not a one-size-fits-all worksheet.' },
  { n: '03', Icon: Trending, t: 'Weekly lessons that build', p: 'Consistent one-to-one lessons where progress compounds and confidence follows the marks.' },
]

export default function HowItWorks() {
  return (
    <section className="block" id="how" data-cy="how-it-works">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">How it works</span>
          <h2>From confusion to confidence in three steps</h2>
          <p>No lock-in contracts, no guesswork. We start by understanding exactly where your child is stuck.</p>
        </div>
        <div className="steps">
          {STEPS.map((step) => (
            <div className="step" key={step.n}>
              <span className="num">{step.n}</span>
              <div className="step-ico"><step.Icon /></div>
              <h3>{step.t}</h3>
              <p>{step.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
