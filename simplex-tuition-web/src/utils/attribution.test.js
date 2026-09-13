import { describe, it } from 'vitest'
import { classifyTouch, mergeTouch, captureAttribution, getAttribution } from './attribution'

const DAY = 24 * 60 * 60 * 1000
const SHEET_CHANNELS = ['Google', 'Facebook', 'Referral', 'Other']

describe('classifyTouch', () => {
  const cases = [
    [{ search: '?utm_source=google&utm_medium=organic&utm_campaign=gbp' }, 'Google', 'Google Business Profile'],
    [{ search: '?utm_source=google&utm_medium=cpc&utm_campaign=term4' }, 'Google', 'Google Ads'],
    [{ search: '?gclid=abc' }, 'Google', 'Google Ads'],
    [{ search: '?utm_source=facebook&utm_medium=paid' }, 'Facebook', 'Facebook/Instagram ad'],
    [{ search: '?fbclid=xyz' }, 'Facebook', 'Facebook/Instagram link'],
    [{ search: '?utm_source=qr&utm_medium=print&utm_campaign=door-sign' }, 'Other', 'Print/QR (qr)'],
    [{ referrer: 'https://www.google.com/' }, 'Google', 'Google search'],
    [{ referrer: 'https://maps.google.com/' }, 'Google', 'Google Maps'],
    [{ referrer: 'https://l.facebook.com/l.php' }, 'Facebook', 'Facebook/Instagram'],
    [{ referrer: 'https://www.bing.com/search' }, 'Other', 'Search engine (bing.com)'],
    [{ referrer: 'https://chatgpt.com/' }, 'Other', 'AI assistant (chatgpt.com)'],
    [{ referrer: 'https://schoolnews.example.org/post' }, 'Other', 'Website (schoolnews.example.org)'],
  ]

  cases.forEach(([input, channel, detail]) => {
    it(`${JSON.stringify(input)} → ${channel} / ${detail}`, () => {
      const t = classifyTouch(input)
      expect(t.channel).toBe(channel)
      expect(t.detail).toBe(detail)
      expect(t.direct).toBe(false)
    })
  })

  it('treats no referrer as direct', () => {
    const t = classifyTouch({})
    expect(t.direct).toBe(true)
    expect(t.channel).toBe('Other')
  })

  it('ignores the site’s own pages as a referrer', () => {
    expect(classifyTouch({ referrer: 'https://simplextuition.com.au/tutoring' }).direct).toBe(true)
  })

  it('UTM tags win over the referrer', () => {
    expect(classifyTouch({ search: '?utm_source=google&utm_campaign=gbp', referrer: 'https://www.google.com/' }).detail).toBe('Google Business Profile')
  })

  it('only ever produces a value from the sheet dropdown, never Referral', () => {
    const inputs = [{}, { search: '?utm_source=newsletter&utm_medium=email' }, { referrer: 'https://x.com' }, { search: '?utm_source=fb' }]
    inputs.forEach((i) => {
      const { channel } = classifyTouch(i)
      expect(SHEET_CHANNELS).toContain(channel)
      expect(channel).not.toBe('Referral')
    })
  })
})

describe('mergeTouch', () => {
  const gbp = classifyTouch({ search: '?utm_source=google&utm_campaign=gbp' })
  const direct = classifyTouch({})
  const fb = classifyTouch({ search: '?fbclid=1' })

  it('a direct return visit keeps the real source', () => {
    const s1 = mergeTouch(null, gbp, 0)
    const s2 = mergeTouch(s1, direct, 10 * DAY)
    expect(s2.last.detail).toBe('Google Business Profile')
  })

  it('a newer real source replaces the last touch but not the first', () => {
    const s1 = mergeTouch(null, gbp, 0)
    const s2 = mergeTouch(s1, fb, 5 * DAY)
    expect(s2.last.channel).toBe('Facebook')
    expect(s2.first.detail).toBe('Google Business Profile')
  })

  it('a source older than 90 days no longer gets the credit', () => {
    const s1 = mergeTouch(null, gbp, 0)
    const s2 = mergeTouch(s1, direct, 91 * DAY)
    expect(s2.last.direct).toBe(true)
  })

  it('a direct first visit is upgraded when a real source arrives', () => {
    const s1 = mergeTouch(null, direct, 0)
    const s2 = mergeTouch(s1, gbp, DAY)
    expect(s2.last.detail).toBe('Google Business Profile')
    expect(s2.first.direct).toBe(true)
  })
})

describe('capture + get', () => {
  const fakeWindow = (search, referrer = '') => ({
    location: { search, pathname: '/' },
    document: { referrer },
    localStorage: window.localStorage,
  })

  it('round-trips a GBP visit into flat lead fields', () => {
    window.localStorage.clear()
    captureAttribution(fakeWindow('?utm_source=google&utm_medium=organic&utm_campaign=gbp'))
    captureAttribution(fakeWindow(''))
    const a = getAttribution(window)
    expect(a.channel).toBe('Google')
    expect(a.channel_detail).toBe('Google Business Profile')
    expect(a.utm_campaign).toBe('gbp')
    expect(a.landing_page).toBe('/?utm_source=google&utm_medium=organic&utm_campaign=gbp')
  })

  it('falls back safely with no stored data', () => {
    window.localStorage.clear()
    expect(getAttribution(window).channel).toBe('Other')
  })
})
