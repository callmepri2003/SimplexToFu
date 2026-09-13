import { Plus } from '../icons'

export default function FAQ({ title = 'The things parents ask first.', items }) {
  return (
    <section className="block faq-block" id="faq" data-cy="faq">
      <div className="wrap faq-wrap">
        <div className="sec-head">
          <p className="eyebrow">Questions</p>
          <h2>{title}</h2>
        </div>
        <div className="faq">
          {items.map((item) => (
            <details className="qa" key={item.q}>
              <summary>{item.q}<span className="ic"><Plus /></span></summary>
              <p className="ans">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
