import { useNavigate } from 'react-router-dom'
import styles from './DiagnosticOffer.module.css'

export default function DiagnosticOffer({ pathId }) {
  const navigate = useNavigate()

  return (
    <div className={styles.offer}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.icon}>🧠</div>
          <div className={styles.text}>
            <h3 className={styles.heading}>Want to make our first conversation even more useful?</h3>
            <p className={styles.body}>
              Take the optional 5-minute diagnostic so I know exactly where your child
              stands before I call. It takes 8 questions and helps me prepare a specific
              plan for your child.
            </p>
          </div>
          <div className={styles.actions}>
            <button
              className="btn-primary"
              data-cy="diagnostic-offer-yes"
              onClick={() => navigate(`/diagnostic?path=${pathId}`)}
            >
              Yes, take the diagnostic →
            </button>
            <button
              className={styles.skip}
              data-cy="diagnostic-offer-skip"
              onClick={() => navigate('/thank-you')}
            >
              No thanks, just call me
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
