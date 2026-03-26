import DiagnosticFlow from '../components/diagnostic/DiagnosticFlow'
import styles from './Diagnostic.module.css'

export default function Diagnostic() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>S</div>
          <span className={styles.logoText}>Simplex Tuition</span>
        </div>
      </div>
      <DiagnosticFlow />
    </div>
  )
}
