import { describe, it } from 'vitest'
import { distanceKm, driveMinutes, describeDistance } from './distance'
import { BASE, SUBURBS } from '../data/geo'

describe('distanceKm', () => {
  it('is zero at the base itself', () => {
    expect(distanceKm(BASE)).toBeLessThan(0.01)
  })

  it('puts Leppington within a few km of the space', () => {
    const lep = SUBURBS.find((s) => s.name === 'Leppington')
    expect(distanceKm(lep)).toBeGreaterThan(1)
    expect(distanceKm(lep)).toBeLessThan(8)
  })

  it('agrees with the real geography: Oran Park is further than Leppington', () => {
    const km = (n) => distanceKm(SUBURBS.find((s) => s.name === n))
    expect(km('Oran Park')).toBeGreaterThan(km('Leppington'))
  })

  it('puts Liverpool further away than Carnes Hill', () => {
    const km = (n) => distanceKm(SUBURBS.find((s) => s.name === n))
    expect(km('Liverpool')).toBeGreaterThan(km('Carnes Hill'))
  })

  it('is symmetric', () => {
    const a = SUBURBS[3]
    expect(distanceKm(a, BASE)).toBeCloseTo(distanceKm(BASE, a), 6)
  })
})

describe('driveMinutes', () => {
  it('never claims less than 2 minutes', () => {
    expect(driveMinutes(0)).toBe(2)
  })

  it('grows with distance', () => {
    expect(driveMinutes(10)).toBeGreaterThan(driveMinutes(3))
  })
})

describe('describeDistance', () => {
  it('reads as an estimate, never an exact time', () => {
    expect(describeDistance(4).line).toMatch(/About .* roughly \d+ minutes by car\./)
  })

  it('tells far-away families to call first instead of promising', () => {
    expect(describeDistance(40).line).toMatch(/give us a call/)
  })

  it('has a friendly answer for the next street over', () => {
    expect(describeDistance(0.4).line).toMatch(/next door/)
  })
})
