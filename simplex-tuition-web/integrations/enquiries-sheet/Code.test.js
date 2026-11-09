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

function load(sheet, calendar = { events: [] }) {
  let cacheCount = 0
  // Sydney is UTC+10 in September and UTC+11 in November; good enough for the dates these tests use.
  const sydneyDate = (d) => {
    const month = d.getUTCMonth() + 1
    const shifted = new Date(d.getTime() + (month >= 10 || month <= 3 ? 11 : 10) * 3600000)
    return shifted.toISOString().slice(0, 10)
  }
  const ctx = {
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => TOKEN }) },
    CacheService: { getScriptCache: () => ({ get: () => String(cacheCount), put: (_k, v) => { cacheCount = Number(v) } }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: (n) => (n === 'Enquiries' ? sheet : null) }) },
    // "Now" is frozen at 14 Sep 2026; a booked slot keeps its real date.
    Utilities: { formatDate: (d) => (Math.abs(d.getTime() - Date.now()) < 60000 ? '2026-09-14' : sydneyDate(d)) },
    ContentService: { createTextOutput: (t) => ({ setMimeType: () => JSON.parse(t) }), MimeType: { JSON: 'json' } },
    CalendarApp: {
      getDefaultCalendar: () => ({
        createEvent: (title, start, end, opts) => {
          const id = `ev${calendar.events.length + 1}`
          const ev = { title, start, end, ...opts, getId: () => id }
          calendar.events.push(ev)
          return ev
        },
        // Real overlap semantics: an event is returned if it overlaps [from, to).
        getEvents: (from, to) => calendar.events
          .filter((ev) => !from || !to || (ev.start < to && ev.end > from))
          .map((ev) => ({ getTitle: () => ev.title, getStartTime: () => ev.start })),
      }),
    },
  }
  runInNewContext(source, ctx)
  const post = (body) => ctx.doPost({ postData: { contents: JSON.stringify(body) } })
  post.get = () => ctx.doGet()
  return post
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
    expect(res).toMatchObject({ ok: true, row: 3 })
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

  it('leaves Trial Date and the calendar alone for an ordinary lead', () => {
    const calendar = { events: [] }
    post = load(sheet, calendar)
    post(lead)
    expect(sheet.grid[2][5]).toBe('')
    expect(calendar.events).toHaveLength(0)
  })
})

describe('Groundwork bookings', () => {
  const booking = {
    ...lead,
    name: 'Nadia (Yusuf)', child: 'Yusuf', yearLevel: 'Year 6', email: 'nadia@example.com',
    concern: 'Groundwork diagnostic · Tue 3 Nov, 4:00pm · In our home (12 Example Street, Austral)',
    slotStart: '2026-11-03T16:00:00+11:00', slotLabel: 'Tue 3 Nov, 4:00pm', where: 'In our home', address: '12 Example Street, Austral',
    formLocation: 'groundwork', channel: 'Facebook', channelDetail: 'Facebook / Instagram ad',
  }
  let sheet, calendar, post
  beforeEach(() => {
    sheet = makeSheet([])
    calendar = { events: [] }
    post = load(sheet, calendar)
  })

  it('fills Trial Date with the booked day and creates a one-hour calendar event at the parent’s address', () => {
    const res = post(booking)
    expect(res).toMatchObject({ ok: true, row: 2, eventId: 'ev1' })
    const trial = sheet.grid[1][5]
    expect([trial.getFullYear(), trial.getMonth() + 1, trial.getDate()]).toEqual([2026, 11, 3])
    expect(calendar.events).toHaveLength(1)
    const ev = calendar.events[0]
    expect(ev.title).toBe('Groundwork diagnostic · Yusuf (Year 6)')
    expect(ev.start.toISOString()).toBe('2026-11-03T05:00:00.000Z')
    expect(ev.end.getTime() - ev.start.getTime()).toBe(60 * 60000)
    expect(ev.location).toBe('12 Example Street, Austral')
    expect(ev.description).toContain('Phone: 0412 345 678')
    expect(ev.description).toContain('Facebook / Instagram ad')
  })

  it('uses the Austral space as the location when the family comes to us', () => {
    post({ ...booking, where: 'At the Austral space', address: '' })
    expect(calendar.events[0].location).toBe('27 Carnamah Rd, Austral NSW 2179')
    expect(calendar.events[0].description).toContain('Austral space')
  })

  it('refuses a slot that is already booked, and writes nothing', () => {
    expect(post(booking).ok).toBe(true)
    const second = post({ ...booking, name: 'Amal (Rania)', child: 'Rania', phone: '0400 000 000' })
    expect(second).toEqual({ ok: false, error: 'slot_taken' })
    expect(calendar.events).toHaveLength(1)
    expect(sheet.grid[2][2]).toBe('') // no second Enquiries row
  })

  it('refuses an overlapping slot even when the start differs', () => {
    post(booking) // 4:00–5:00pm
    const overlap = post({ ...booking, name: 'Overlap', slotStart: '2026-11-03T16:30:00+11:00' })
    expect(overlap).toEqual({ ok: false, error: 'slot_taken' })
  })

  it('allows the hour after a booking', () => {
    post(booking)
    expect(post({ ...booking, name: 'Next hour', slotStart: '2026-11-03T17:00:00+11:00' }).ok).toBe(true)
    expect(calendar.events).toHaveLength(2)
  })

  it('invites the parent as a guest when she gave an email, so Google sends the confirmation', () => {
    post(booking)
    expect(calendar.events[0]).toMatchObject({ guests: 'nadia@example.com', sendInvites: true })
    post({ ...booking, email: 'not an email', slotStart: '2026-11-03T18:00:00+11:00' })
    expect(calendar.events[1].guests).toBeUndefined()
  })

  it('ignores a slot it cannot parse rather than failing the lead', () => {
    expect(post({ ...booking, slotStart: 'next tuesday-ish' })).toMatchObject({ ok: true, eventId: '' })
    expect(calendar.events).toHaveLength(0)
  })

  it('tells the page which slots are taken, and nothing else', () => {
    // GET only reports upcoming events, so these bookings must stay in the future.
    const inDays = (d, hour) => { const t = new Date(); t.setDate(t.getDate() + d); t.setHours(hour, 0, 0, 0); return t }
    const first = inDays(3, 16)
    const second = inDays(4, 17)
    post({ ...booking, slotStart: first.toISOString() })
    post({ ...booking, name: 'Amal (Rania)', child: 'Rania', slotStart: second.toISOString() })
    const res = post.get()
    expect(res.ok).toBe(true)
    expect(res.taken).toEqual([first.toISOString(), second.toISOString()])
    expect(JSON.stringify(res)).not.toContain('Nadia')
  })
})
