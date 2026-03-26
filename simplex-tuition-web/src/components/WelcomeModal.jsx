import { useState, useEffect } from 'react'
import styles from './WelcomeModal.module.css'
import { trackEvent } from '../hooks/useAnalytics'

const STEPS = {
  WHO: 'who',
  SCHOOL: 'school',
  CONCERN: 'concern',
}

const CONCERNS_PRIMARY = [
  { id: 'struggling', label: 'Falling behind in class', emoji: '📉' },
  { id: 'assessment', label: 'Assessment or exam coming up', emoji: '📝' },
  { id: 'ahead', label: 'Want to get ahead', emoji: '🚀' },
]

const CONCERNS_HIGH = [
  { id: 'struggling', label: 'Falling behind', emoji: '📉' },
  { id: 'assessment', label: 'HSC or assessment prep', emoji: '📝' },
  { id: 'selective', label: 'Selective / OC prep', emoji: '🎯' },
  { id: 'ahead', label: 'Extension or enrichment', emoji: '🚀' },
]

export default function WelcomeModal({ onComplete }) {
  const [step, setStep] = useState(STEPS.WHO)
  const [school, setSchool] = useState(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    trackEvent('modal_opened')
  }, [])

  const concerns = school === 'primary' ? CONCERNS_PRIMARY : CONCERNS_HIGH

  const handleWho = (selection) => {
    trackEvent('modal_who_selected', { who: selection })
    if (selection === 'student') {
      finish('student')
    } else {
      setStep(STEPS.SCHOOL)
    }
  }

  const handleSchool = (selection) => {
    trackEvent('modal_school_selected', { school: selection })
    setSchool(selection)
    setStep(STEPS.CONCERN)
  }

  const handleConcern = (concern) => {
    trackEvent('modal_concern_selected', { concern })
    finish(concern)
  }

  const finish = (pathId) => {
    trackEvent('path_selected', { path: pathId })
    setVisible(false)
    setTimeout(() => onComplete(pathId), 300)
  }

  if (!visible) return null

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal} data-cy="welcome-modal">
        <div className={styles.logo}>
          <div className={styles.logoMark}>S</div>
          <span className={styles.logoText}>Simplex Tuition</span>
        </div>

        {step === STEPS.WHO && (
          <div className={styles.step}>
            <h2 className={styles.heading}>Welcome — let's make this useful for you.</h2>
            <p className={styles.sub}>Are you a parent or a student?</p>
            <div className={styles.options}>
              <button className={styles.option} data-cy="modal-option-parent" onClick={() => handleWho('parent')}>
                <span className={styles.optionEmoji}>👨‍👩‍👧</span>
                <div>
                  <span className={styles.optionLabel}>I'm a parent</span>
                  <span className={styles.optionSub}>Looking for tutoring for my child</span>
                </div>
              </button>
              <button className={styles.option} data-cy="modal-option-student" onClick={() => handleWho('student')}>
                <span className={styles.optionEmoji}>🎒</span>
                <div>
                  <span className={styles.optionLabel}>I'm a student</span>
                  <span className={styles.optionSub}>Looking for help myself</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === STEPS.SCHOOL && (
          <div className={styles.step}>
            <h2 className={styles.heading}>What school level is your child in?</h2>
            <div className={styles.options}>
              <button className={styles.option} data-cy="modal-option-primary" onClick={() => handleSchool('primary')}>
                <span className={styles.optionEmoji}>🏫</span>
                <div>
                  <span className={styles.optionLabel}>Primary School</span>
                  <span className={styles.optionSub}>Years K–6</span>
                </div>
              </button>
              <button className={styles.option} data-cy="modal-option-high" onClick={() => handleSchool('high')}>
                <span className={styles.optionEmoji}>🎓</span>
                <div>
                  <span className={styles.optionLabel}>High School</span>
                  <span className={styles.optionSub}>Years 7–12</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === STEPS.CONCERN && (
          <div className={styles.step}>
            <h2 className={styles.heading}>What's the main thing you're hoping to solve?</h2>
            <div className={styles.concernOptions}>
              {concerns.map((c) => (
                <button
                  key={c.id}
                  className={styles.concernOption}
                  data-cy={`modal-concern-${c.id}`}
                  onClick={() => handleConcern(c.id)}
                >
                  <span className={styles.concernEmoji}>{c.emoji}</span>
                  <span className={styles.concernLabel}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.dots}>
          {[STEPS.WHO, STEPS.SCHOOL, STEPS.CONCERN].map((s, i) => (
            <div
              key={s}
              data-cy={`modal-dot-${i}`}
              className={`${styles.dot} ${step === s ? styles.dotActive : ''} ${
                [STEPS.WHO, STEPS.SCHOOL, STEPS.CONCERN].indexOf(step) > i ? styles.dotDone : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
