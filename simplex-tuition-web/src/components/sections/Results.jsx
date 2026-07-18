import { Stars } from '../icons'

const REVIEWS = [
  {
    init: 'H', bg: 'linear-gradient(135deg,#004aad,#4d8bff)',
    text: '"I was really struggling with preliminary HSC Advanced Maths. Pri accurately found the gaps in my learning and the study habits I needed to fix. I ended up getting 93% in my most recent Advanced Maths exam."',
    n: "Hamoodi's Dad", r: 'HSC Advanced Maths · Google',
  },
  {
    init: 'M', bg: 'linear-gradient(135deg,#2f8f6b,#57c199)',
    text: '"My son has ADHD and really needs extra support. Ryan didn\'t want to go on the first day, but they made him feel comfortable and made learning fun. Now he looks forward to going every week."',
    n: 'Melissa B', r: 'Parent · Google',
  },
  {
    init: 'H', bg: 'linear-gradient(135deg,#e0912f,#f6b545)',
    text: '"Simplex is the best place to improve maths. My daughter got selected into the advanced class and started enjoying maths after studying here."',
    n: 'Hitashi K', r: 'Parent · Google',
  },
]

export default function Results() {
  return (
    <section className="block results" id="results">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Results &amp; families</span>
          <h2>Marks move when the teaching fits the child</h2>
        </div>
        <div className="stat-row">
          <div className="stat"><div className="big">5.0<span style={{ fontSize: '.5em' }}>&#9733;</span></div><div className="lbl">Across 13 Google reviews</div></div>
          <div className="stat"><div className="big">93<span style={{ fontSize: '.5em' }}>%</span></div><div className="lbl">HSC Advanced Maths, from a struggling prelim</div></div>
          <div className="stat"><div className="big">37&rarr;76<span style={{ fontSize: '.5em' }}>%</span></div><div className="lbl">Advanced Maths, in one term</div></div>
        </div>
        <div className="quotes">
          {REVIEWS.map((q, i) => (
            <div className="quote" key={i}>
              <Stars />
              <p>{q.text}</p>
              <div className="who">
                <span className="ava" style={{ background: q.bg }}>{q.init}</span>
                <span><span className="n">{q.n}</span><br /><span className="r">{q.r}</span></span>
              </div>
            </div>
          ))}
        </div>
        <div className="reviews-link"><a href="#book">Read all 13 reviews on Google &rarr;</a></div>
      </div>
    </section>
  )
}
