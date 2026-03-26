import { Link } from 'react-router-dom'
import styles from './ThankYou.module.css'

export default function ThankYou() {
  return (
    <div className={styles.page} data-cy="thank-you-page">
      <div className={styles.card}>
        <div className={styles.icon}>📞</div>
        <h1 className={styles.heading}>You're all set.</h1>
        <p className={styles.body}>
          I'll call you within 24 hours. If it's urgent, call directly:
        </p>
        <a href="tel:+61400000000" className={styles.phone}>0452330300</a>
        <Link to="/" className={styles.back}>← Back to home</Link>
      </div>
    </div>
  )
}
