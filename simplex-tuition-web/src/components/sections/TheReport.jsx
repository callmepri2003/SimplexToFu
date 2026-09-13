// Trigger #1 from the avatar document: the school said something. The six-word
// teacher comment is the hook, re-enacted as a taped note rather than a crisis.
export default function TheReport() {
  return (
    <section className="block report" data-cy="the-report">
      <div className="wrap report-grid">
        <figure className="note taped report-note">
          <figcaption className="note-label">From the school report</figcaption>
          <blockquote>“Do more work at home.”</blockquote>
        </figure>
        <div className="report-copy">
          <h2>Six words most parents read twice.</h2>
          <p>Then comes the harder question. Who is going to sit down with them and do that work?</p>
          <p>After a long day at work, there often isn't much left for fractions. And sometimes the homework isn't in your first language.</p>
          <p className="report-turn">That doesn't mean you're doing anything wrong. It means your child needs a patient explainer, once a week, sitting right beside them.</p>
        </div>
      </div>
    </section>
  )
}
