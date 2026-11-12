import { describe, it } from 'vitest'
import { NEXT, WHAT_HAPPENS_NEXT_PATH } from './whatHappensNextCopy'

// The avatar document's banned words (AVATAR_MASTER §8), as on every other copy file.
const BANNED = [/\belite\b/i, /excellence/i, /unlock/i, /potential/i, /guarantee/i, /struggling/i, /\btrial\b/i]
const copy = JSON.stringify(NEXT)

describe('what-happens-next copy', () => {
  it('lives off the Groundwork landing page path', () => {
    expect(WHAT_HAPPENS_NEXT_PATH).toBe('/what-happens-next')
    expect(WHAT_HAPPENS_NEXT_PATH.startsWith('/groundwork')).toBe(false)
  })

  it('uses none of the banned words and never says "trial"', () => {
    BANNED.forEach((re) => expect(copy).not.toMatch(re))
  })

  it('publishes no price', () => {
    expect(copy).not.toMatch(/\$\s?\d/)
  })

  it('has one swipe in the h1, behind two to four words, and the h1 is not a question', () => {
    const words = NEXT.hero.h1[1].trim().split(/\s+/)
    expect(words.length).toBeGreaterThanOrEqual(2)
    expect(words.length).toBeLessThanOrEqual(4)
    expect(NEXT.hero.h1.join('')).not.toContain('?')
  })

  it('every section heading is a sentence with a full stop', () => {
    ;[NEXT.why.h2, NEXT.hour.h2, NEXT.final.h2, NEXT.faqTitle].forEach((h) => expect(h).toMatch(/\.$/))
  })

  it('says what happens next before anything else: a call today', () => {
    expect(NEXT.hero.sub).toMatch(/call you today/)
  })

  it('names the Austral address, so a parent can picture where she might go', () => {
    expect(NEXT.final.where).toMatch(/27 Carnamah Rd, Austral/)
  })
})
