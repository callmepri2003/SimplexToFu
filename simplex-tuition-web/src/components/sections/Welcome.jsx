import { GREETINGS } from '../../data/content'

// Recognition for the multilingual households across the corridor (avatar §1),
// with the honest limit stated plainly: the tutor is the explainer, so a parent
// who can't help with the homework doesn't have to.
export default function Welcome() {
  return (
    <section className="block welcome" data-cy="welcome">
      <div className="wrap welcome-wrap">
        <ul className="greetings">
          {GREETINGS.map((g) => (
            <li key={g.label}>
              <span className="greet-script" lang={g.lang} dir={g.rtl ? 'rtl' : undefined}>{g.script}</span>
              {g.latin && <span className="greet-latin">{g.latin}</span>}
            </li>
          ))}
        </ul>
        <p className="welcome-line">
          Every family here is welcome, whatever language is spoken at home.
          Lessons are taught in English, and the tutor does the explaining — so if the homework isn't in your language, it doesn't have to be your job.
        </p>
      </div>
    </section>
  )
}
