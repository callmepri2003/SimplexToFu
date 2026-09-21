import teaser from '../../data/skillsMapTeaser.json'
import { MAP_LANDING } from '../../data/skillsChainCopy'
import { trackEvent } from '../../hooks/useAnalytics'
import MapSignup from '../MapSignup'

const COPY = MAP_LANDING.try

// A taste of the map before the email: tap a topic, see how far back it reaches. The numbers
// are real (scripts/sync-chain.js works them out from the chain). A few skills are named, to
// show the map is written in plain words; the rest are covered until the map is open.
//
// One topic is already chosen when the page loads, so nothing here waits on a tap or an
// animation to be read (WEBSITE_GUIDELINES §11).
export default function MapTeaser({ topic, onPick, hasAccess }) {
  const [lead, count] = COPY.result(topic.chip, topic.count) // the parent's word for it, not the syllabus's
  return (
    <section className="block map-try" data-cy="map-try">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{COPY.eyebrow}</p>
          <h2>{COPY.h2}</h2>
          <p>{COPY.sub}</p>
        </div>

        <div className="chips map-chips" role="group" aria-label="Topics">
          {teaser.topics.map((t) => (
            <button key={t.id} type="button" className={`chip${t.id === topic.id ? ' on' : ''}`} aria-pressed={t.id === topic.id}
              onClick={() => { trackEvent('map_teaser_pick', { topic: t.chip }); onPick(t) }} data-cy={`map-topic-${t.id}`}>
              {t.chip}
            </button>
          ))}
        </div>

        <div className="map-try-grid">
          <div className="map-strip" aria-live="polite" data-cy="map-strip">
            <p className="map-strip-head">{lead}<strong>{count}</strong></p>
            <ol className="map-stages">
              {topic.stages.map((st) => (
                <li key={st.label}>
                  <span className="map-stage-label">{st.label}</span>
                  <span className="map-stage-count">{st.count} {st.count === 1 ? 'skill' : 'skills'}</span>
                  <ul className="map-names">
                    {st.names.map((n) => <li key={n}>{n}</li>)}
                    {st.count > st.names.length && <li className="map-hidden">{COPY.hidden(st.count - st.names.length)}</li>}
                  </ul>
                </li>
              ))}
              <li className="map-stage-target">
                <span className="map-stage-label">{topic.stage}</span>
                <span className="map-target">{topic.label}</span>
              </li>
            </ol>
          </div>

          <div className="map-try-cta">
            <p>{COPY.turn}</p>
            <MapSignup location="map-try" topic={topic} hasAccess={hasAccess} />
          </div>
        </div>
      </div>
    </section>
  )
}
