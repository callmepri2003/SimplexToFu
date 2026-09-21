import { LESSON_PHOTOS } from '../../data/content'

// Each photo ships as name.jpg (fallback) plus name-400.webp and name-800.webp.
const webp = (src, width) => src.replace(/\.jpg$/, `-${width}.webp`)

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
                <picture>
                  <source type="image/webp" srcSet={`${webp(p.src, 400)} 400w, ${webp(p.src, 800)} 800w`} sizes="(max-width: 860px) 45vw, 260px" />
                  <img src={p.src} alt={p.alt} width="800" height="1000" loading="lazy" decoding="async" />
                </picture>
                <figcaption>{p.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
