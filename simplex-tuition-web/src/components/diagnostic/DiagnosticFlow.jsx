import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getQuestions } from '../../data/diagnosticQuestions'
import { trackEvent } from '../../hooks/useAnalytics'
import QuestionCard from './QuestionCard'
import DiagnosticComplete from './DiagnosticComplete'
import styles from './DiagnosticFlow.module.css'

export default function DiagnosticFlow() {
  const [searchParams] = useSearchParams()
  const pathId = searchParams.get('path') ?? 'struggling'

  const [stage, setStage] = useState('setup')
  const [subject, setSubject] = useState('maths')
  const [level, setLevel] = useState('high')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  const questions = getQuestions(subject, level)
  const current = questions[currentIndex]
  const progress = Math.round((currentIndex / questions.length) * 100)

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [current.id]: answer }
    setAnswers(newAnswers)
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setStage('complete')
      trackEvent('diagnostic_completed', { subject, level, path: pathId })
      submitResults(newAnswers)
    }
  }

  const submitResults = async (finalAnswers) => {
    const correct = questions.filter(q => finalAnswers[q.id] === q.answer).length
    const wrong = questions.filter(q => finalAnswers[q.id] && finalAnswers[q.id] !== q.answer)
    try {
      await fetch(import.meta.env.VITE_FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Diagnostic results received',
          subject,
          level,
          score: `${correct}/${questions.length}`,
          weakAreas: wrong.map(q => q.question).join('; '),
          allAnswers: JSON.stringify(finalAnswers),
          path: pathId,
        }),
      })
    } catch (e) {
      // Silent fail
    }
  }

  if (stage === 'setup') {
    return (
      <div className={styles.setup} data-cy="diagnostic-setup">
        <div className={styles.setupCard}>
          <h2 className={styles.setupHeading}>Quick setup</h2>
          <p className={styles.setupSub}>Two things before we start.</p>

          <div className={styles.setupField}>
            <label className={styles.setupLabel}>Subject</label>
            <div className={styles.setupButtons}>
              {['maths', 'english'].map((s) => (
                <button
                  key={s}
                  data-cy={`diagnostic-subject-${s}`}
                  className={`${styles.setupBtn} ${subject === s ? styles.setupBtnActive : ''}`}
                  onClick={() => setSubject(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.setupField}>
            <label className={styles.setupLabel}>School level</label>
            <div className={styles.setupButtons}>
              <button
                data-cy="diagnostic-level-primary"
                className={`${styles.setupBtn} ${level === 'primary' ? styles.setupBtnActive : ''}`}
                onClick={() => setLevel('primary')}
              >
                Primary (K–6)
              </button>
              <button
                data-cy="diagnostic-level-high"
                className={`${styles.setupBtn} ${level === 'high' ? styles.setupBtnActive : ''}`}
                onClick={() => setLevel('high')}
              >
                High School (7–12)
              </button>
            </div>
          </div>

          <button
            className="btn-primary"
            data-cy="diagnostic-start"
            style={{ width: '100%', marginTop: '8px' }}
            onClick={() => setStage('handoff')}
          >
            Start diagnostic →
          </button>
        </div>
      </div>
    )
  }

  if (stage === 'handoff') {
    return (
      <div className={styles.handoff} data-cy="diagnostic-handoff">
        <div className={styles.handoffCard}>
          <div className={styles.handoffEmoji}>👋</div>
          <h2 className={styles.handoffHeading}>Time to hand over to your child</h2>
          <p className={styles.handoffBody}>
            8 quick questions. No pressure — this just helps us understand where they are
            so we can prepare for our first conversation.
          </p>
          <button
            className="btn-primary"
            data-cy="diagnostic-handoff-confirm"
            style={{ width: '100%' }}
            onClick={() => setStage('questions')}
          >
            I'm ready — let's go →
          </button>
        </div>
      </div>
    )
  }

  if (stage === 'complete') {
    return <DiagnosticComplete answers={answers} questions={questions} />
  }

  return (
    <div className={styles.flow}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          data-cy="diagnostic-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className={styles.counter} data-cy="diagnostic-counter">
        Question {currentIndex + 1} of {questions.length}
      </div>
      <QuestionCard question={current} onAnswer={handleAnswer} />
    </div>
  )
}
