import { describe, it, expect } from 'vitest'
import chain from './skillsChain.json'

const raw = JSON.stringify(chain)

// This file is public. simplexSkillsChain produces two exports: parents.json (safe) and
// chain.json (the diagnostic test statements, syllabus codes and internal notes).
// Only the first may ever be synced here.
describe('skillsChain.json is the parent-safe export', () => {
  it.each(['can_do', 'provenance', 'judgment', 'observed', 'dot_point', 'syllabus_note', 'outcomes'])('does not contain "%s"', (word) => {
    expect(raw).not.toContain(word)
  })

  it('contains no NESA outcome codes or syllabus refs', () => {
    expect(raw).not.toMatch(/\bMA[E1-5]-[A-Z0-9]+-|\bM(ST|AV|E1|E2)-1[12]-|\bS[1-5]-[A-Z0-9]+-[A-D]\b|\b(ADV|STD[12]?|EX[12])-1[12]-[A-Z]{3}/)
  })

  it('has only the fields a parent-facing page needs', () => {
    const allowed = ['id', 'band', 'group', 'spine', 'topic', 'label', 'line', 'why', 'when', 'forWhom', 'needs', 'leadsTo']
    chain.skills.forEach((s) => Object.keys(s).forEach((k) => expect(allowed).toContain(k)))
  })
})

describe('the chain hangs together', () => {
  const ids = new Set(chain.skills.map((s) => s.id))

  it('covers Kindergarten to Year 12', () => {
    expect(chain.skills.length).toBeGreaterThan(100)
    expect(chain.bands[0].years).toContain('K')
    expect(chain.bands.at(-1).years).toContain('12')
  })

  it('every link points at a skill that exists, in a stage that exists', () => {
    const bands = new Set(chain.bands.map((b) => b.key))
    chain.skills.forEach((s) => {
      expect(bands.has(s.band)).toBe(true)
      ;[...s.needs, ...s.leadsTo].forEach((id) => expect(ids.has(id)).toBe(true))
    })
  })

  it('every skill has a plain sentence and a card label', () => {
    chain.skills.forEach((s) => {
      expect(s.line.length).toBeGreaterThan(10)
      expect(s.label.length).toBeGreaterThan(2)
    })
  })
})
