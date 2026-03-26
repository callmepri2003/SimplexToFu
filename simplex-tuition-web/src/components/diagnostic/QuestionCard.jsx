import { useState } from 'react'
import styles from './QuestionCard.module.css'

export default function QuestionCard({ question, onAnswer }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (option) => {
    if (selected) return
    setSelected(option)
    setTimeout(() => {
      onAnswer(option)
      setSelected(null)
    }, 400)
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.question} data-cy="question-text">{question.question}</h2>
      <div className={styles.options}>
        {question.options.map((option, i) => (
          <button
            key={option}
            data-cy={`question-option-${i}`}
            className={`${styles.option} ${selected === option ? styles.optionSelected : ''}`}
            onClick={() => handleSelect(option)}
            disabled={!!selected}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
