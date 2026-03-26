import { useEffect, useRef } from 'react'
import styles from './HowItWorks.module.css'

const STEPS = [
  {
    number: '01',
    title: 'We find the gaps',
    body: 'Not just "Year 9 Algebra" — we identify exactly which concepts your child is missing. The first session is diagnostic, not generic.'
  },
  {
    number: '02',
    title: 'We build the plan',
    body: "Every student gets a custom resource set built around their specific gaps. Nothing off the shelf. No worksheets your child's already seen."
  },
  {
    number: '03',
    title: 'We track the progress',
    body: "Every session is logged. You always know where your child stands — not just 'they're improving' but exactly which concepts are now solid."
  },
]

export default function HowItWorks({ pathId }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-up').forEach((el) => {
              el.classList.add('visible')
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.section} data-cy="how-it-works" ref={ref}>
      <div className="container">
        <div className={`${styles.header} fade-up`}>
          <div className={styles.label}>The Simplex method</div>
          <h2 className={styles.heading}>How it works</h2>
        </div>
        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <div key={i} className={`${styles.step} fade-up`}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={`${styles.callout} fade-up`}>
          <div className={styles.calloutIcon}>💻</div>
          <div>
            <div className={styles.calloutTitle}>Built by a software engineer</div>
            <div className={styles.calloutBody}>
              I'm a Computer Science student at UNSW. I built the system I use to
              track and personalise every student's journey — because spreadsheets
              weren't good enough. When I say custom resources, I mean it technically.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
