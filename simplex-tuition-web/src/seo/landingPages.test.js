/* global process */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it } from 'vitest'
import { PRERENDER_PATHS } from './pages'

// docs/landing-pages.md is the registry of every page traffic is sent to. A page that is built
// but never written down is how a campaign ends up pointing at a page nobody remembers owning.
// Vitest runs from simplex-tuition-web (locally and in CI); the registry sits one level up.
const registry = readFileSync(resolve(process.cwd(), '../docs/landing-pages.md'), 'utf8')
const listed = (path) => registry.includes(`\`${path}\``)

describe('landing page registry', () => {
  it('lists every prerendered route, suburb pages as one templated row', () => {
    PRERENDER_PATHS.forEach((path) => {
      const row = path.startsWith('/tutoring/') ? '/tutoring/<suburb>' : path
      expect(listed(row), `${path} is missing from docs/landing-pages.md`).toBe(true)
    })
  })

  it('lists the retired path that still redirects', () => {
    expect(listed('/diagnostic')).toBe(true)
  })

  it('gives every row the columns the table promises', () => {
    const rows = registry.split('\n').filter((l) => /^\| `\//.test(l))
    expect(rows.length).toBeGreaterThanOrEqual(PRERENDER_PATHS.length - 20) // suburbs collapse into one row
    rows.forEach((r) => expect(r.split('|').length - 2, r).toBe(7))
  })
})
