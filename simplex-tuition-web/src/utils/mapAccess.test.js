import { describe, it, expect, beforeEach } from 'vitest'
import { grantMapAccess, hasMapAccess, passFromSearch, safeNext } from './mapAccess'

describe('map access', () => {
  beforeEach(() => window.localStorage.clear())

  it('starts closed, and opens once an email has been given', () => {
    expect(hasMapAccess()).toBe(false)
    grantMapAccess('email')
    expect(hasMapAccess()).toBe(true)
  })

  it('treats damaged storage as no access, without throwing', () => {
    window.localStorage.setItem('simplex_map_access_v1', '{not json')
    expect(hasMapAccess()).toBe(false)
  })

  it('lets in a link from a tutor, and nothing that merely looks like one', () => {
    expect(passFromSearch('?pass=family')).toBe(true)
    expect(passFromSearch('?utm_source=facebook&pass=family')).toBe(true)
    expect(passFromSearch('?pass=nope')).toBe(false)
    expect(passFromSearch('')).toBe(false)
  })

  it('only ever sends a parent on to a place on the map', () => {
    expect(safeNext('#path=M-78-10')).toBe('#path=M-78-10')
    expect(safeNext('#year=8')).toBe('#year=8')
    expect(safeNext('https://example.com')).toBe('')
    expect(safeNext('//example.com')).toBe('')
    expect(safeNext('#path=<script>')).toBe('')
    expect(safeNext(undefined)).toBe('')
  })
})
