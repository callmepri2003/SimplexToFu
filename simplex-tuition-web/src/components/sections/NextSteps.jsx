import { STEPS } from '../../data/content'

export default function NextSteps() {
  return (
    <section className="block steps-block" id="how" data-cy="next-steps">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">How it starts</p>
          <h2>What happens after you leave your number.</h2>
        </div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li className="step" key={s.title}>
              <span className="step-num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
