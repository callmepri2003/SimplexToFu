// Bookable diagnostic slots for the Groundwork page: the next two weeks of Simplex's hours, in
// Sydney time, minus anything already booked. Pure, so it is unit-tested and the component just draws it.
//
// Hours (Pri, Oct 2026): weekday afternoons and evenings, Saturdays. Sunday is not offered. A
// diagnostic takes an hour, so starts are an hour apart. Bookings open from tomorrow: nobody is
// driving to Leppington in forty minutes.
export const TIMEZONE = 'Australia/Sydney'
export const DAYS_AHEAD = 14
const WEEKDAY_STARTS = [16, 17, 18, 19] // 4pm, 5pm, 6pm, 7pm
const SATURDAY_STARTS = [9, 10, 11, 13, 14, 15]

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// The calendar date (y, m, d, weekday) that `date` falls on in Sydney, whatever the browser's zone.
function sydneyParts(date) {
  const parts = new Intl.DateTimeFormat('en-AU', { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })
    .formatToParts(date)
  const get = (t) => parts.find((p) => p.type === t)?.value
  return { y: Number(get('year')), m: Number(get('month')), d: Number(get('day')), weekday: DAY_NAMES.indexOf(get('weekday')) }
}

// Sydney's UTC offset, in minutes, at a given instant (handles daylight saving).
function sydneyOffsetMinutes(date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TIMEZONE, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    .formatToParts(date)
  const get = (t) => Number(parts.find((p) => p.type === t)?.value)
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'))
  return Math.round((asUtc - date.getTime()) / 60000)
}

// An ISO string with Sydney's offset for y-m-d at `hour` local time, e.g. 2026-11-04T16:00:00+11:00.
export function sydneyIso(y, m, d, hour) {
  const guess = new Date(Date.UTC(y, m - 1, d, hour))
  const offset = sydneyOffsetMinutes(guess)
  const instant = new Date(guess.getTime() - offset * 60000)
  const sign = offset >= 0 ? '+' : '-'
  const abs = Math.abs(offset)
  const pad = (n) => String(n).padStart(2, '0')
  const offsetStr = `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  return `${y}-${pad(m)}-${pad(d)}T${pad(hour)}:00:00${offsetStr}` + (instant ? '' : '')
}

export const timeLabel = (hour) => (hour === 12 ? '12:00pm' : hour > 12 ? `${hour - 12}:00pm` : `${hour}:00am`)

// Days from tomorrow for DAYS_AHEAD days, each with its slots. `taken` is a list of ISO starts
// already booked (from the calendar); those slots are kept but flagged so the page can grey them.
export function bookableDays({ now = new Date(), taken = [] } = {}) {
  const takenSet = new Set(taken.map((t) => new Date(t).getTime()))
  const days = []
  for (let i = 1; i <= DAYS_AHEAD; i++) {
    const probe = new Date(now.getTime() + i * 86400000)
    const { y, m, d, weekday } = sydneyParts(probe)
    if (weekday === 0) continue
    const starts = weekday === 6 ? SATURDAY_STARTS : WEEKDAY_STARTS
    const slots = starts.map((hour) => {
      const start = sydneyIso(y, m, d, hour)
      return { start, label: timeLabel(hour), taken: takenSet.has(new Date(start).getTime()) }
    })
    days.push({
      key: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      label: `${DAY_NAMES[weekday]} ${d} ${MONTHS[m - 1]}`,
      weekday: DAY_NAMES[weekday],
      dayNum: d,
      month: MONTHS[m - 1],
      slots,
      open: slots.filter((s) => !s.taken).length,
    })
  }
  return days
}

// "Tue 4 Nov, 4:00pm" for the button and the thank-you page.
export const slotLabel = (day, slot) => `${day.label}, ${slot.label}`
