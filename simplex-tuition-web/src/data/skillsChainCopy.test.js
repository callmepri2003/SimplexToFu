import { describe, it, expect } from 'vitest'
import { CHAIN_BOOK, CHAIN_COPY, DIAGNOSTIC_OFFER, MAP_LANDING } from './skillsChainCopy'
import teaser from './skillsMapTeaser.json'
import chain from './skillsChain.json'

// The same rules content.js is held to (AVATAR_MASTER §8, WEBSITE_GUIDELINES §7 and §9).
const BANNED = [/\belite\b/i, /excellence/i, /unlock/i, /potential/i, /guarantee/i, /struggling students/i]

// Functions in the copy take a number; call them so their words are tested too.
const words = (value) => {
  if (typeof value === 'function') return words(value(29, 29))
  if (Array.isArray(value)) return value.map(words).join(' ')
  if (value && typeof value === 'object') return Object.values(value).map(words).join(' ')
  return String(value ?? '')
}
const allCopy = words({ MAP_LANDING, CHAIN_COPY, CHAIN_BOOK, DIAGNOSTIC_OFFER })

describe('maths skills map copy', () => {
  it('uses none of the banned marketing words', () => {
    BANNED.forEach((re) => expect(allCopy).not.toMatch(re))
  })

  it('never shows a dollar amount', () => {
    expect(allCopy).not.toMatch(/\$\d+/)
  })

  it('never uses a question as the headline', () => {
    expect(MAP_LANDING.h1.join('')).not.toMatch(/\?/)
    expect(CHAIN_COPY.title).not.toMatch(/\?/)
  })

  it('puts the one highlighter swipe behind two to four words of the headline', () => {
    const swiped = MAP_LANDING.h1[1].trim().split(/\s+/)
    expect(swiped.length).toBeGreaterThanOrEqual(2)
    expect(swiped.length).toBeLessThanOrEqual(4)
  })

  it('writes every section heading as a sentence with a full stop', () => {
    const headings = [MAP_LANDING.try.h2, MAP_LANDING.report.h2, MAP_LANDING.inside.h2, MAP_LANDING.proofSection.h2, MAP_LANDING.final.h2, MAP_LANDING.faqTitle, CHAIN_BOOK.heading, ...MAP_LANDING.inside.points.map((p) => p.title)]
    headings.forEach((h) => expect(h, h).toMatch(/\.$/))
  })

  it('invents no social proof: no counts of parents, families or users', () => {
    expect(allCopy).not.toMatch(/\b(\d[\d,]*\+?|hundreds of|thousands of|many)\s+(parents|families|users|people)\b/i)
  })
})

describe('the landing page preview', () => {
  it('is worked out from the chain that is actually shipped', () => {
    expect(teaser.skills).toBe(chain.skills.length)
    teaser.topics.forEach((t) => {
      expect(chain.skills.some((s) => s.id === t.id)).toBe(true)
      expect(t.stages.reduce((n, st) => n + st.count, 0)).toBe(t.count)
      t.stages.forEach((st) => expect(st.names.length).toBeLessThanOrEqual(2)) // the rest stay covered until the map is open
    })
  })

  it('carries names and counts only: no sentences, codes or notes', () => {
    const raw = JSON.stringify(teaser)
    expect(raw).not.toMatch(/can_do|why|provenance|\bMA[E1-5]-|\bMST-/)
    expect(raw.length).toBeLessThan(6000)
  })

  it('draws a real line of the chain in the hero', () => {
    expect(teaser.heroLine.length).toBeGreaterThanOrEqual(3)
    teaser.heroLine.forEach((s) => { expect(s.label).toBeTruthy(); expect(s.stage).toBeTruthy() })
  })
})
