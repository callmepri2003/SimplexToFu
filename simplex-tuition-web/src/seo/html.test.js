// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, it } from 'vitest'
import { render } from '../entry-server'
import { locations } from '../data/locations'
import { applySeo } from './html'
import { PRERENDER_PATHS, seoForPath } from './pages'

// The same pipeline scripts/prerender.js runs, against the real index.html.
const template = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')
const page = (path, marker = path) => applySeo(template, { seo: seoForPath(path), appHtml: render(path), marker })

const count = (html, re) => (html.match(re) || []).length
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]))

describe('prerendered pages', () => {
  it('index.html carries no JSON-LD of its own, so pages never get two businesses', () => {
    expect(template).not.toContain('application/ld+json')
  })

  it.each(PRERENDER_PATHS)('%s has one title, one h1 and its content in the HTML', (path) => {
    const html = page(path)
    expect(count(html, /<title>/g)).toBe(1)
    expect(count(html, /<h1[ >]/g)).toBe(1)
    expect(count(html, /name="description"/g)).toBe(1)
    expect(html).toContain(`data-prerendered="${path}"`)
    expect(html).not.toContain('<div id="root"></div>')
  })

  it('writes each suburb page’s own head and copy, not the homepage’s', () => {
    locations.forEach((loc) => {
      const html = page(`/tutoring/${loc.slug}`)
      expect(html).toContain(`<link rel="canonical" href="https://simplextuition.com.au/tutoring/${loc.slug}" />`)
      expect(html).toContain(`<meta property="og:url" content="https://simplextuition.com.au/tutoring/${loc.slug}" />`)
      expect(html).toContain(`<title>Maths &amp; English Tutoring in ${loc.name} | Simplex Tuition</title>`)
      expect(html).toContain(loc.schools[0])
      expect(html).not.toContain('content="Simplex Tuition — Keep them on track"')
    })
  })

  it('keeps the homepage’s link-preview wording', () => {
    const html = page('/')
    expect(html).toContain('<meta property="og:title" content="Simplex Tuition — Keep them on track" />')
    expect(html).toContain('<link rel="canonical" href="https://simplextuition.com.au/" />')
    expect(html).toContain('<meta name="robots" content="index, follow" />')
  })

  it('embeds one valid JSON-LD block per indexable page', () => {
    for (const path of ['/', '/tutoring', '/tutoring/liverpool']) {
      const blocks = jsonLd(page(path))
      expect(blocks).toHaveLength(1)
      expect(blocks[0]).toEqual(seoForPath(path).jsonLd)
    }
  })

  it('noindexes the thank-you and not-found pages and drops their canonical', () => {
    for (const html of [page('/thank-you'), page('/404', '404'), page('/tutoring/nowhere', '404')]) {
      expect(html).toContain('<meta name="robots" content="noindex, follow" />')
      expect(html).not.toContain('rel="canonical"')
      expect(html).not.toContain('og:url')
      expect(jsonLd(html)).toHaveLength(0)
    }
    expect(page('/404', '404')).toContain('data-cy="not-found-page"')
    expect(page('/tutoring/nowhere', '404')).toContain('data-cy="not-found-page"')
  })
})

describe('applySeo', () => {
  const seo = { title: 'A "quoted" <title> & more', description: 'Plain "description"', canonical: 'https://example.com/?a=1&b=2' }

  it('escapes values written into tags and attributes', () => {
    const html = applySeo(template, { seo, appHtml: '', marker: '/' })
    expect(html).toContain('<title>A "quoted" &lt;title> &amp; more</title>')
    expect(html).toContain('content="Plain &quot;description&quot;"')
    expect(html).toContain('href="https://example.com/?a=1&amp;b=2"')
  })

  it('cannot be broken out of by copy inside JSON-LD', () => {
    const html = applySeo(template, { seo: { ...seo, jsonLd: { text: '</script><script>alert(1)</script>' } }, appHtml: '', marker: '/' })
    expect(html).not.toContain('</script><script>alert(1)')
    expect(jsonLd(html)[0].text).toBe('</script><script>alert(1)</script>')
  })

  it('leaves "$" sequences in rendered markup untouched', () => {
    expect(applySeo(template, { seo, appHtml: '<p>$& $1 $$</p>', marker: '/' })).toContain('<p>$& $1 $$</p>')
  })

  it('fails loudly when index.html loses a tag it needs to rewrite', () => {
    expect(() => applySeo(template.replace(/<link rel="canonical"[^>]*>/, ''), { seo, appHtml: '', marker: '/' })).toThrow(/canonical not found/)
    expect(() => applySeo(template.replace('<div id="root"></div>', ''), { seo, appHtml: '', marker: '/' })).toThrow(/#root not found/)
  })
})
