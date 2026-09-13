import { COMPARISON } from '../../data/content'
import { Check, Cross } from '../icons'

// The anti-classroom (avatar §5): the differentiation in customers' own words.
export default function OneOnOne() {
  return (
    <section className="block one" data-cy="one-on-one">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">Why one-on-one</p>
          <h2>No competition in the class. No rushing. Just your child and their tutor.</h2>
          <p>A coaching class has to move at the speed of the room. A one-on-one lesson moves at the speed of your child.</p>
        </div>

        <div className="compare" role="table" aria-label="A coaching class compared with Simplex">
          <div className="compare-head" role="row">
            <span role="columnheader"><span className="sr-only">What matters</span></span>
            <span role="columnheader">A coaching class</span>
            <span role="columnheader" className="us">Simplex</span>
          </div>
          {COMPARISON.map((c) => (
            <div className="compare-row" role="row" key={c.row}>
              <span role="rowheader" className="compare-label">{c.row}</span>
              <span role="cell" className="them"><Cross /> {c.them}</span>
              <span role="cell" className="us"><Check /> {c.us}</span>
            </div>
          ))}
        </div>

        <p className="margin-note">It should never feel forced. If your child doesn't like coming, it isn't working.</p>
      </div>
    </section>
  )
}
