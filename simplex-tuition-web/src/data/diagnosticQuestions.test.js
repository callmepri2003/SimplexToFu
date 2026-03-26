import { describe, it, expect } from 'vitest'
import { getQuestions } from './diagnosticQuestions'

describe('getQuestions', () => {
  it('returns 8 questions for maths/high', () => {
    expect(getQuestions('maths', 'high')).toHaveLength(8)
  })

  it('returns 8 questions for maths/primary', () => {
    expect(getQuestions('maths', 'primary')).toHaveLength(8)
  })

  it('returns 8 questions for english/high', () => {
    expect(getQuestions('english', 'high')).toHaveLength(8)
  })

  it('returns 8 questions for english/primary', () => {
    expect(getQuestions('english', 'primary')).toHaveLength(8)
  })

  it('returns empty array for unknown subject', () => {
    expect(getQuestions('physics', 'high')).toEqual([])
  })

  it('every question has id, question, 4 options, and an answer', () => {
    ['maths', 'english'].forEach((subject) => {
      ['high', 'primary'].forEach((level) => {
        getQuestions(subject, level).forEach((q) => {
          expect(q).toHaveProperty('id')
          expect(q).toHaveProperty('question')
          expect(q.options).toHaveLength(4)
          expect(q.options).toContain(q.answer)
        })
      })
    })
  })

  it('all question ids within a set are unique', () => {
    ['maths', 'english'].forEach((subject) => {
      ['high', 'primary'].forEach((level) => {
        const set = getQuestions(subject, level)
        const ids = set.map((q) => q.id)
        expect(new Set(ids).size).toBe(ids.length)
      })
    })
  })

  it('no two options within a question are identical', () => {
    getQuestions('maths', 'high').forEach((q) => {
      expect(new Set(q.options).size).toBe(q.options.length)
    })
  })
})
