import { describe, it } from 'vitest'
import { CONCERNS, DOORS, FAQS, REVIEWS, STEPS, TUTOR_POINTS, YEAR_LEVELS } from './content'
import { locations, getLocation } from './locations'
import { whatsappUrl } from '../utils/contact'

// Words the avatar document bans from customer-facing copy (AVATAR_MASTER §8).
const BANNED = [/\belite\b/i, /excellence/i, /unlock/i, /potential/i, /guarantee/i, /struggling students/i]

const allCopy = () => JSON.stringify({ CONCERNS, DOORS, FAQS, STEPS, TUTOR_POINTS, locations })

describe('content', () => {
  it('uses none of the banned marketing words', () => {
    const copy = allCopy()
    BANNED.forEach((re) => expect(copy).not.toMatch(re))
  })

  it('never features a review from the owner’s family', () => {
    REVIEWS.forEach((r) => expect(r.who).not.toMatch(/hitash/i))
  })

  it('does not publish an hourly price', () => {
    expect(allCopy()).not.toMatch(/\$\d+/)
  })

  it('covers Kindergarten to Year 12', () => {
    expect(YEAR_LEVELS[0]).toBe('Kindergarten')
    expect(YEAR_LEVELS.at(-1)).toBe('Year 12')
    expect(YEAR_LEVELS).toHaveLength(13)
  })

  it('has unique concern ids', () => {
    const ids = CONCERNS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('offers both doors: fix and protect', () => {
    expect(DOORS).toHaveLength(2)
  })
})

describe('locations', () => {
  it('every suburb has the fields its page needs', () => {
    locations.forEach((l) => {
      expect(l.slug).toMatch(/^[a-z-]+$/)
      expect(l.postcode).toMatch(/^2\d{3}$/)
      ;['name', 'lede', 'localNote'].forEach((k) => expect(l[k].length).toBeGreaterThan(3))
      expect(l.schools.length).toBeGreaterThan(0)
      expect(l.faq.q).toBeTruthy()
      expect(l.faq.a).toBeTruthy()
    })
  })

  it('looks suburbs up by slug', () => {
    expect(getLocation('leppington').name).toBe('Leppington')
    expect(getLocation('nowhere')).toBeUndefined()
  })
})

describe('whatsappUrl', () => {
  it('links to the business number with an encoded message', () => {
    const url = whatsappUrl('Hi & hello')
    expect(url).toBe('https://wa.me/61452330300?text=Hi%20%26%20hello')
  })

  it('has a default booking message', () => {
    expect(whatsappUrl()).toContain('free%20first%20lesson')
  })
})
