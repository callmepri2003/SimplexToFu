import { describe, it, expect } from 'vitest'
import { GROUNDWORK, GROUNDWORK_PATH } from './groundworkCopy'

// The same rules content.js and skillsChainCopy.js are held to (WEBSITE_GUIDELINES §7, §9),
// plus the one this page adds: price is never on the page (decision 0003).
const BANNED = [/\belite\b/i, /excellence/i, /unlock/i, /potential/i, /guarantee/i, /struggling students/i]

const allCopy = () => JSON.stringify(GROUNDWORK, (k, v) => (typeof v === 'function' ? v('x') : v))

describe('groundwork copy', () => {
  it('lives at /groundwork', () => {
    expect(GROUNDWORK_PATH).toBe('/groundwork')
  })

  it('uses none of the banned marketing words', () => {
    const copy = allCopy()
    BANNED.forEach((re) => expect(copy).not.toMatch(re))
  })

  it('never shows a price', () => {
    expect(allCopy()).not.toMatch(/\$\d+/)
  })

  it('has one highlighter swipe in the h1, behind 2 to 4 words, and the h1 is not a question', () => {
    const [before, swipe, after] = GROUNDWORK.hero.h1
    expect(swipe.trim().split(/\s+/).length).toBeGreaterThanOrEqual(2)
    expect(swipe.trim().split(/\s+/).length).toBeLessThanOrEqual(4)
    expect(`${before}${swipe}${after}`).not.toMatch(/\?/)
  })

  it('every section heading is a sentence with a full stop', () => {
    ;[GROUNDWORK.hour.h2, GROUNDWORK.story.h2, GROUNDWORK.proof.h2, GROUNDWORK.faqTitle, GROUNDWORK.book.h2].forEach((h) => expect(h).toMatch(/\.$/))
  })

  it('never calls the hour a trial', () => {
    expect(allCopy()).not.toMatch(/\btrial\b/i)
  })

  it('names the chain with real skills from the map', () => {
    expect(GROUNDWORK.story.chain.map((n) => n.label)).toContain('Halves, quarters and eighths')
    expect(GROUNDWORK.story.chain.at(-1).state).toBe('gap')
  })
})
