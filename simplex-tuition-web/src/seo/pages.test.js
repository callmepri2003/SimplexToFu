import { describe, it } from 'vitest'
import { locations } from '../data/locations'
import { FAQS, REVIEW_COUNT } from '../data/content'
import { INDEXABLE_PATHS, ORIGIN, PRERENDER_PATHS, seoForPath, sitemapXml } from './pages'

const nodes = (seo) => seo.jsonLd['@graph']
const ofType = (seo, type) => nodes(seo).filter((n) => [].concat(n['@type']).includes(type))

describe('seoForPath', () => {
  it('gives every indexable page its own title, description and canonical', () => {
    const pages = INDEXABLE_PATHS.map(seoForPath)
    for (const field of ['title', 'description', 'canonical']) {
      expect(new Set(pages.map((p) => p[field])).size).toBe(pages.length)
    }
  })

  it('canonicals are the non-www https URL of the page itself', () => {
    INDEXABLE_PATHS.forEach((path) => expect(seoForPath(path).canonical).toBe(`${ORIGIN}${path}`))
    expect(ORIGIN).toBe('https://simplextuition.com.au')
  })

  it('describes exactly one business, with the same @id, on every indexable page', () => {
    INDEXABLE_PATHS.forEach((path) => {
      const businesses = ofType(seoForPath(path), 'LocalBusiness')
      expect(businesses).toHaveLength(1)
      expect(businesses[0]['@id']).toBe(`${ORIGIN}/#business`)
    })
  })

  it('publishes no self-written review and no placeholder street address', () => {
    const business = ofType(seoForPath('/'), 'LocalBusiness')[0]
    expect(business.review).toBeUndefined()
    expect(business.address.streetAddress).toBeUndefined()
    expect(business.aggregateRating.reviewCount).toBe(String(REVIEW_COUNT))
  })

  it('lists Austral and every suburb page as an area served', () => {
    const { areaServed } = ofType(seoForPath('/'), 'LocalBusiness')[0]
    expect(areaServed).toEqual(['Austral', ...locations.map((l) => l.name)])
  })

  it('marks up every homepage FAQ', () => {
    const faq = ofType(seoForPath('/'), 'FAQPage')[0]
    expect(faq.mainEntity.map((q) => q.name)).toEqual(FAQS.map((f) => f.q))
  })

  it('leads each suburb page FAQ with that suburb’s own question', () => {
    locations.forEach((loc) => {
      const faq = ofType(seoForPath(`/tutoring/${loc.slug}`), 'FAQPage')[0]
      expect(faq.mainEntity[0].name).toBe(loc.faq.q)
      expect(faq.mainEntity.length).toBeGreaterThan(1)
    })
  })

  it('ends each suburb breadcrumb on the page itself', () => {
    const seo = seoForPath('/tutoring/prestons')
    const crumbs = ofType(seo, 'BreadcrumbList')[0].itemListElement
    expect(crumbs.map((c) => c.name)).toEqual(['Home', 'Tutoring', 'Prestons'])
    expect(crumbs.at(-1).item).toBe(seo.canonical)
  })

  it('keeps the thank-you page and unknown URLs out of the index', () => {
    for (const path of ['/thank-you', '/tutoring/nowhere', '/tutoring/leppington/extra', '/anything-else']) {
      const seo = seoForPath(path)
      expect(seo.robots).toMatch(/noindex/)
      expect(seo.canonical).toBeUndefined()
      expect(seo.jsonLd).toBeUndefined()
    }
  })
})

describe('sitemapXml', () => {
  const xml = sitemapXml('2026-09-21')

  it('lists every indexable page once, with a lastmod', () => {
    INDEXABLE_PATHS.forEach((path) => expect(xml).toContain(`<loc>${ORIGIN}${path}</loc>`))
    expect(xml.match(/<loc>/g)).toHaveLength(INDEXABLE_PATHS.length)
    expect(xml.match(/<lastmod>2026-09-21<\/lastmod>/g)).toHaveLength(INDEXABLE_PATHS.length)
  })

  it('leaves out the pages that are noindex', () => {
    expect(PRERENDER_PATHS).toContain('/thank-you')
    expect(xml).not.toContain('thank-you')
  })
})
