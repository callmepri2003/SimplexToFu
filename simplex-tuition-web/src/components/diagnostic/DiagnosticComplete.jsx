import styles from './DiagnosticComplete.module.css'

export default function DiagnosticComplete({ answers, questions }) {
  const correct = questions.filter(q => answers[q.id] === q.answer).length

  return (
    <div className={styles.complete} data-cy="diagnostic-complete">
      <div className={styles.card}>
        <div className={styles.emoji}>✅</div>
        <h2 className={styles.heading}>Great work!</h2>
        <p className={styles.body}>
          Your results have been sent to Priyanshu. He'll use these to prepare
          for your conversation so the first session can start immediately.
        </p>
        <div className={styles.promise}>
          📞 Expect a call within 24 hours.
        </div>
      </div>
    </div>
  )
}
