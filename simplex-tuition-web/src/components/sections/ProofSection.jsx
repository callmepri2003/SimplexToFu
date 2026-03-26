import styles from './ProofSection.module.css'

export default function ProofSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.review}>
            <div className={styles.stars}>★★★★★</div>
            <blockquote className={styles.quote} data-cy="proof-quote">
              "Helped me get from 37% to 76% in Advanced Maths. Highly recommended."
            </blockquote>
            <div className={styles.attribution}>— Google Review</div>
          </div>
          <div className={styles.stats} data-cy="proof-stats">
            <div className={styles.stat}>
              <div className={styles.statNumber}>37% → 76%</div>
              <div className={styles.statLabel}>Advanced Maths, one term</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>K–12</div>
              <div className={styles.statLabel}>Primary and high school</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>Maths & English</div>
              <div className={styles.statLabel}>Both subjects covered</div>
            </div>
          </div>
        </div>

        <div className={styles.space}>
          <div className={styles.spaceText}>
            <div className={styles.label}>The setup</div>
            <h3 className={styles.spaceHeading}>A dedicated tutoring space — not a kitchen table.</h3>
            <p className={styles.spaceBody}>
              Located in Austral, the Simplex Tuition space has dedicated tables,
              whiteboards, and everything needed for a focused, distraction-free session.
              In-person and online options available.
            </p>
          </div>
          <div className={styles.spaceImagePlaceholder}>
            <div className={styles.imagePlaceholderInner}>
              📸 Add your garage photo here
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
