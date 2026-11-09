import { describe, it, expect } from 'vitest'
import { bookableDays, sydneyIso, timeLabel, DAYS_AHEAD } from './slots'

// A Monday evening in Sydney, during daylight saving (UTC+11).
const NOW = new Date('2026-11-02T08:00:00+11:00')

describe('bookable diagnostic slots', () => {
  it('starts tomorrow and covers two weeks, with no Sundays', () => {
    const days = bookableDays({ now: NOW })
    expect(days[0].key).toBe('2026-11-03')
    expect(days.at(-1).key).toBe('2026-11-16')
    expect(days.some((d) => d.weekday === 'Sun')).toBe(false)
    expect(days.length).toBe(DAYS_AHEAD - 2)
  })

  it('offers weekday afternoons and evenings, and Saturday mornings and afternoons', () => {
    const days = bookableDays({ now: NOW })
    const tue = days.find((d) => d.key === '2026-11-03')
    const sat = days.find((d) => d.key === '2026-11-07')
    expect(tue.slots.map((s) => s.label)).toEqual(['4:00pm', '5:00pm', '6:00pm', '7:00pm'])
    expect(sat.slots.map((s) => s.label)).toEqual(['9:00am', '10:00am', '11:00am', '1:00pm', '2:00pm', '3:00pm'])
  })

  it('writes starts in Sydney time with the daylight-saving offset', () => {
    expect(sydneyIso(2026, 11, 3, 16)).toBe('2026-11-03T16:00:00+11:00')
    expect(sydneyIso(2026, 6, 3, 16)).toBe('2026-06-03T16:00:00+10:00')
  })

  it('flags slots already booked, whatever offset the calendar wrote them with', () => {
    const days = bookableDays({ now: NOW, taken: ['2026-11-03T05:00:00Z'] }) // = 4pm Sydney
    const tue = days.find((d) => d.key === '2026-11-03')
    expect(tue.slots[0]).toMatchObject({ label: '4:00pm', taken: true })
    expect(tue.slots[1].taken).toBe(false)
    expect(tue.open).toBe(3)
  })

  it('labels the day the way a parent reads it', () => {
    expect(bookableDays({ now: NOW })[0].label).toBe('Tue 3 Nov')
    expect(timeLabel(12)).toBe('12:00pm')
    expect(timeLabel(9)).toBe('9:00am')
  })
})
