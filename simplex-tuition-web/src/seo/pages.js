import { FAQS, PHONE, PHONE_DISPLAY, REVIEW_COUNT } from '../data/content'
import { locations, getLocation } from '../data/locations'
import { CHAIN_PATH } from '../data/skillsChainCopy'

// Per-page <head> data as plain functions, so the same values feed useSeo in
// the browser and the build-time prerender (scripts/prerender.js). Crawlers
// that don't run JavaScript only ever see the prerendered copy.

export const ORIGIN = 'https://simplextuition.com.au'
const OG_IMAGE = `${ORIGIN}/brand/end-card-1920x1080.png`
const NOINDEX = 'noindex, follow'

// Questions every suburb page repeats under its own local one.
const SHARED_FAQ_QUESTIONS = ['How much does it cost?', 'Is it really one-on-one?', 'Is the first lesson really free?', 'Will my child feel pushed?']

export function locationFaqs(loc) {
  return [loc.faq, ...FAQS.filter((f) => SHARED_FAQ_QUESTIONS.includes(f.q))]
}

// One business entity, with one @id, identical on every page. No street address
// is published, and no "review" node: Google ignores review markup a business
// writes about itself, so only the count shown on the page is repeated here.
function businessNode() {
  return {
    '@type': ['LocalBusiness', 'EducationalOrganization'],
    '@id': `${ORIGIN}/#business`,
    name: 'Simplex Tuition',
    description: 'One-on-one Maths and English tutoring for Kindergarten to Year 12 in Austral, NSW. Same tutor every week, at our Austral space or in your home.',
    url: `${ORIGIN}/`,
    telephone: PHONE,
    image: OG_IMAGE,
    address: { '@type': 'PostalAddress', addressLocality: 'Austral', addressRegion: 'NSW', postalCode: '2179', addressCountry: 'AU' },
    geo: { '@type': 'GeoCoordinates', latitude: -33.9185, longitude: 150.8199 },
    areaServed: ['Austral', ...locations.map((l) => l.name)],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '15:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday', 'Sunday'], opens: '08:00', closes: '18:00' },
    ],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: String(REVIEW_COUNT) },
  }
}

function faqNode(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

function breadcrumbNode(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  }
}

const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes })

export function homeSeo() {
  return {
    title: 'Simplex Tuition — One-on-One Maths & English Tutoring, Austral',
    description: 'One-on-one maths and English tutoring in Austral and nearby suburbs, Kindergarten to Year 12. Same tutor every week, at our space or in your home. Book a free first lesson.',
    canonical: `${ORIGIN}/`,
    // Link previews (WhatsApp, Facebook) lead with the promise, not the keywords.
    ogTitle: 'Simplex Tuition — Keep them on track',
    ogDescription: 'One-on-one maths and English tutoring in Austral, K–12. Same tutor every week. Your first lesson is free.',
    jsonLd: graph(
      { '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: 'Simplex Tuition', inLanguage: 'en-AU' },
      businessNode(),
      faqNode(FAQS),
    ),
  }
}

export function hubSeo() {
  const canonical = `${ORIGIN}/tutoring`
  return {
    title: 'Maths & English Tutoring in South-West Sydney | Simplex Tuition',
    description: 'One-on-one maths and English tutoring across south-west Sydney: Austral, Leppington, Edmondson Park, Carnes Hill, Prestons, Liverpool and more. At our Austral space or in your home. Free first lesson.',
    canonical,
    jsonLd: graph(
      businessNode(),
      breadcrumbNode([['Home', `${ORIGIN}/`], ['Tutoring', canonical]]),
      {
        '@type': 'ItemList',
        itemListElement: locations.map((l, i) => ({
          '@type': 'ListItem', position: i + 1, name: `Tutoring in ${l.name}`, url: `${ORIGIN}/tutoring/${l.slug}`,
        })),
      },
    ),
  }
}

export function locationSeo(loc) {
  const canonical = `${ORIGIN}/tutoring/${loc.slug}`
  return {
    title: `Maths & English Tutoring in ${loc.name} | Simplex Tuition`,
    description: `One-on-one maths and English tutoring in ${loc.name} (${loc.postcode}), Kindergarten to Year 12. Same tutor every week, at our Austral space or in your home. Free first lesson — call ${PHONE_DISPLAY}.`,
    canonical,
    jsonLd: graph(
      businessNode(),
      breadcrumbNode([['Home', `${ORIGIN}/`], ['Tutoring', `${ORIGIN}/tutoring`], [loc.name, canonical]]),
      faqNode(locationFaqs(loc)),
    ),
  }
}

export function chainSeo() {
  const canonical = `${ORIGIN}${CHAIN_PATH}`
  return {
    title: 'The Maths Skills Chain, Kindergarten to Year 12 | Simplex Tuition',
    description: 'Every maths skill from Kindergarten to Year 12 on one chain, in plain words. Tap the skill your child finds hard and see the earlier skills it depends on. NSW syllabus.',
    canonical,
    ogTitle: 'Stuck in maths? See why.',
    ogDescription: 'All of school maths as one chain. Tap the skill your child finds hard and see what it depends on.',
    jsonLd: graph(
      businessNode(),
      breadcrumbNode([['Home', `${ORIGIN}/`], ['Maths skills chain', canonical]]),
    ),
  }
}

export function thankYouSeo() {
  return {
    title: 'Thanks — we’ll call you within 24 hours | Simplex Tuition',
    description: 'Thanks for booking a free first lesson with Simplex Tuition. We’ll call you within 24 hours to find a time.',
    robots: NOINDEX,
  }
}

export function notFoundSeo() {
  return {
    title: 'Page not found | Simplex Tuition',
    description: 'That page doesn’t exist. Head back to Simplex Tuition for one-on-one maths and English tutoring in Austral and nearby suburbs.',
    robots: NOINDEX,
  }
}

// Every path the build writes to static HTML, and the subset worth indexing.
export const INDEXABLE_PATHS = ['/', '/tutoring', ...locations.map((l) => `/tutoring/${l.slug}`), CHAIN_PATH]
export const PRERENDER_PATHS = [...INDEXABLE_PATHS, '/thank-you']

export function seoForPath(path) {
  if (path === '/') return homeSeo()
  if (path === '/tutoring') return hubSeo()
  if (path === CHAIN_PATH) return chainSeo()
  if (path === '/thank-you') return thankYouSeo()
  const suburb = path.match(/^\/tutoring\/([^/]+)$/)
  const loc = suburb && getLocation(suburb[1])
  return loc ? locationSeo(loc) : notFoundSeo()
}

export function sitemapXml(lastmod) {
  const urls = INDEXABLE_PATHS.map((p) => `  <url>\n    <loc>${ORIGIN}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}
