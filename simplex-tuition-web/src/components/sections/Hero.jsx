import { paths, defaultPath } from '../../data/pathContent'
import styles from './Hero.module.css'

export default function Hero({ pathId }) {
  const content = paths[pathId] ?? defaultPath

  const scrollToForm = () => {
    document.getElementById('callback-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.badge}>
          ★★★★★ &nbsp;"Helped me get from 37% to 76% in Advanced Maths"
        </div>
        <h1 className={styles.headline} data-cy="hero-headline">{content.heroHeadline}</h1>
        <p className={styles.sub} data-cy="hero-sub">{content.heroSub}</p>
        <div className={styles.actions}>
          <button className="btn-primary btn-accent" data-cy="hero-cta" onClick={scrollToForm}>
            {content.heroCTA} →
          </button>
          <div className={styles.trust}>
            <span>📍 Austral, Sydney</span>
            <span>·</span>
            <span>Maths & English</span>
            <span>·</span>
            <span>Years K–12</span>
          </div>
        </div>
      </div>
    </section>
  )
}
