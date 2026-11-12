import { describe, it } from 'vitest'
import { CHAIN_IDS, EXAMPLE_IDS, NEXT, SKILL_COUNT, WHAT_HAPPENS_NEXT_PATH, skill } from './whatHappensNextCopy'

// The avatar document's banned words (AVATAR_MASTER §8), as on every other copy file.
const BANNED = [/\belite\b/i, /excellence/i, /unlock/i, /potential/i, /guarantee/i, /struggling/i, /\btrial\b/i]
const copy = JSON.stringify(NEXT)
const headings = [NEXT.years.h2, NEXT.map.h2, NEXT.diagnostic.h2, NEXT.program.h2, NEXT.between.h2, NEXT.parent.h2, NEXT.not.h2, NEXT.faqTitle, NEXT.final.h2]

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
    headings.forEach((h) => expect(h).toMatch(/\.$/))
  })

  it('explains the program rather than asking for a call: no button copy in the hero, the ask is last', () => {
    expect(NEXT.hero).not.toHaveProperty('whatsapp')
    expect(NEXT.final.whatsapp).toBeTruthy()
  })

  it('names only real skills, read from the chain data', () => {
    ;[...CHAIN_IDS, ...EXAMPLE_IDS].forEach((id) => {
      const s = skill(id)
      expect(s.name.length).toBeGreaterThan(5)
      expect(s.can).toMatch(/^Can /)
      expect(s.why.length).toBeGreaterThan(20)
      expect(s.band).toMatch(/Year/)
    })
    expect(skill('M-56-09').name).toBe('Adding and subtracting fractions')
  })

  it('counts the Kindergarten to Year 10 skills from the data, and says so', () => {
    expect(SKILL_COUNT).toBeGreaterThan(80)
    expect(NEXT.map.body[0]).toContain(`${SKILL_COUNT} skills`)
  })

  it('describes the four parts of a skill in order', () => {
    expect(NEXT.program.parts.map((p) => p.title)).toEqual(['Pre-test', 'The lessons', 'The run-through', 'The final test'])
  })

  it('names the Austral address, so a parent can picture where she might go', () => {
    expect(NEXT.diagnostic.steps[0].body).toMatch(/27 Carnamah Rd, Austral/)
  })
})
