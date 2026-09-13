// @vitest-environment node
import { describe, it, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

// Runs the real Apps Script file against an in-memory Enquiries tab shaped like
// the live one: ID formula in A, pre-filled FALSE checkboxes in H.
const source = readFileSync(new URL('./Code.gs', import.meta.url), 'utf8')
const TOKEN = 'test-token'

function makeSheet(existingRows) {
  const grid = [['ID', 'Date', 'Name', 'Channel', 'Replied Same Day', 'Trial Date', 'First Paid Lesson', 'Lost', 'Student ID', 'Notes']]
  existingRows.forEach((r) => grid.push(r))
  for (let i = 0; i < 20; i++) grid.push(['', '', '', '', '', '', '', false, '', ''])
  const range = (row, col, rows = 1) => ({
    getValues: () => grid.slice(row - 1, row - 1 + rows).map((r) => [r[col - 1]]),
    setValue(v) { grid[row - 1] ??= []; grid[row - 1][col - 1] = v; return this },
    setNumberFormat() { return this },
  })
  return { grid, getLastRow: () => grid.length, getRange: range }
}

function load(sheet) {
  let cacheCount = 0
  const ctx = {
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => TOKEN }) },
    CacheService: { getScriptCache: () => ({ get: () => String(cacheCount), put: (_k, v) => { cacheCount = Number(v) } }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: (n) => (n === 'Enquiries' ? sheet : null) }) },
    Utilities: { formatDate: () => '2026-09-14' },
    ContentService: { createTextOutput: (t) => ({ setMimeType: () => JSON.parse(t) }), MimeType: { JSON: 'json' } },
  }
  runInNewContext(source, ctx)
  return (body) => ctx.doPost({ postData: { contents: JSON.stringify(body) } })
}

const lead = {
  token: TOKEN, name: 'Nadia', phone: '0412 345 678', yearLevel: 'Year 5', concern: 'The school said something',
  channel: 'Google', channelDetail: 'Google Business Profile', formLocation: 'hero',
}

describe('Enquiries Apps Script', () => {
  let sheet, post
  beforeEach(() => {
    sheet = makeSheet([['=ARRAYFORMULA(...)', 46242, 'Sue', 'Google', 'Y', '', '', false, '', '']])
    post = load(sheet)
  })

  it('writes into the first row with an empty Date, not after the checkboxes', () => {
    const res = post(lead)
    expect(res).toEqual({ ok: true, row: 3 })
    const row = sheet.grid[2]
    expect([row[1].getFullYear(), row[1].getMonth() + 1, row[1].getDate()]).toEqual([2026, 9, 14])
    expect(row[2]).toBe('Nadia')
    expect(row[3]).toBe('Google')
    expect(row[7]).toBe(false) // Lost checkbox untouched
    expect(row[9]).toBe('Website form · 0412 345 678 · Year 5 · "The school said something" · via Google Business Profile · hero form')
  })

  it('never touches the ID column', () => {
    post(lead)
    expect(sheet.grid[2][0]).toBe('')
    expect(sheet.grid[1][0]).toBe('=ARRAYFORMULA(...)')
  })

  it('fills rows in order', () => {
    post(lead)
    expect(post({ ...lead, name: 'Second' }).row).toBe(4)
  })

  it('rejects a wrong token', () => {
    expect(post({ ...lead, token: 'nope' })).toEqual({ ok: false, error: 'unauthorised' })
    expect(sheet.grid[2][2]).toBe('')
  })

  it('forces unknown channels to Other', () => {
    post({ ...lead, channel: 'TikTok' })
    expect(sheet.grid[2][3]).toBe('Other')
  })

  it('neutralises formula injection', () => {
    post({ ...lead, name: '=IMPORTXML("http://evil")' })
    expect(sheet.grid[2][2]).toBe('\'=IMPORTXML("http://evil")')
  })

  it('flags direct visits to ask how they heard', () => {
    post({ ...lead, channel: 'Other', channelDetail: 'Direct (typed, bookmark, or a link shared by text/WhatsApp)' })
    expect(sheet.grid[2][9]).toContain('ASK how they heard about us')
  })

  it('rate-limits floods', () => {
    for (let i = 0; i < 10; i++) post({ ...lead, name: `n${i}` })
    expect(post(lead)).toEqual({ ok: false, error: 'rate_limited' })
  })
})
