import { LESSON_PHOTOS } from '../../data/content'

// Proof by sight (avatar §4: "she saw the tutoring happening"). Real students,
// taped to the page like prints on a fridge.
export default function LessonPhotos() {
  return (
    <section className="block photos" data-cy="lesson-photos">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">Real lessons</p>
          <h2>This is what an hour at Simplex looks like.</h2>
          <p>Real Simplex students, shared with their parents' permission.</p>
        </div>
        <ul className="photo-wall">
          {LESSON_PHOTOS.map((p) => (
            <li key={p.src}>
              <figure className="print taped">
                <img src={p.src} alt={p.alt} width="800" height="1000" loading="lazy" decoding="async" />
                <figcaption>{p.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
