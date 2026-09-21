import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, it } from 'vitest'
import { useSeo } from './useSeo'
import { seoForPath } from '../seo/pages'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

function Page({ seo }) {
  useSeo(seo)
  return null
}

const attr = (selector, name) => document.head.querySelector(selector)?.getAttribute(name) ?? null
const jsonLdBlocks = () => document.head.querySelectorAll('script[type="application/ld+json"]')

describe('useSeo', () => {
  let root
  const show = (path) => act(() => root.render(createElement(Page, { seo: seoForPath(path) })))

  beforeEach(() => {
    // What a prerendered suburb page ships with.
    document.head.innerHTML = `
      <title>old</title>
      <meta name="description" content="old" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://simplextuition.com.au/tutoring/prestons" />
      <meta property="og:url" content="https://simplextuition.com.au/tutoring/prestons" />
      <script type="application/ld+json" data-page-jsonld="true">{"old":true}</script>`
    root = createRoot(document.body.appendChild(document.createElement('div')))
  })

  afterEach(() => act(() => root.unmount()))

  it('replaces the prerendered head, including its JSON-LD, with the current page’s', () => {
    show('/tutoring/leppington')
    expect(document.title).toBe('Maths & English Tutoring in Leppington | Simplex Tuition')
    expect(attr('link[rel="canonical"]', 'href')).toBe('https://simplextuition.com.au/tutoring/leppington')
    expect(attr('meta[property="og:url"]', 'content')).toBe('https://simplextuition.com.au/tutoring/leppington')
    expect(attr('meta[property="og:title"]', 'content')).toBe(document.title)
    expect(jsonLdBlocks()).toHaveLength(1)
    expect(JSON.parse(jsonLdBlocks()[0].textContent)).toEqual(seoForPath('/tutoring/leppington').jsonLd)
  })

  it('uses the homepage’s separate link-preview title', () => {
    show('/')
    expect(attr('meta[property="og:title"]', 'content')).toBe('Simplex Tuition — Keep them on track')
    expect(attr('meta[name="twitter:title"]', 'content')).toBe('Simplex Tuition — Keep them on track')
  })

  it('noindexes the thank-you page and removes canonical, og:url and JSON-LD', () => {
    show('/tutoring/leppington')
    show('/thank-you')
    expect(attr('meta[name="robots"]', 'content')).toBe('noindex, follow')
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull()
    expect(document.head.querySelector('meta[property="og:url"]')).toBeNull()
    expect(jsonLdBlocks()).toHaveLength(0)
  })

  it('makes a page indexable again when navigating back from a noindex page', () => {
    show('/thank-you')
    show('/')
    expect(attr('meta[name="robots"]', 'content')).toBe('index, follow')
    expect(attr('link[rel="canonical"]', 'href')).toBe('https://simplextuition.com.au/')
    expect(jsonLdBlocks()).toHaveLength(1)
  })
})
