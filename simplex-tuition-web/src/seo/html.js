// Writes one page's SEO values and rendered markup into the index.html
// template. Every replacement must find its tag: if index.html drifts, the
// build fails here instead of quietly shipping the homepage's head everywhere.

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

function swap(html, pattern, replacement, what) {
  if (!pattern.test(html)) throw new Error(`prerender: ${what} not found in index.html`)
  return html.replace(pattern, () => replacement)
}

const metaPattern = (attr, key) => new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/>`)
const setMeta = (html, attr, key, value) => swap(html, metaPattern(attr, key), `<meta ${attr}="${key}" content="${escAttr(value)}" />`, `${attr}="${key}"`)

export function applySeo(template, { seo, appHtml, marker }) {
  let html = template
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${escText(seo.title)}</title>`, '<title>')
  html = setMeta(html, 'name', 'description', seo.description)
  html = setMeta(html, 'name', 'robots', seo.robots || 'index, follow')
  html = setMeta(html, 'property', 'og:title', seo.ogTitle || seo.title)
  html = setMeta(html, 'property', 'og:description', seo.ogDescription || seo.description)
  html = setMeta(html, 'name', 'twitter:title', seo.ogTitle || seo.title)
  html = setMeta(html, 'name', 'twitter:description', seo.ogDescription || seo.description)

  // Pages that shouldn't be indexed (thank-you, 404) carry no canonical or og:url.
  const canonical = /<link rel="canonical" href="[^"]*"\s*\/>/
  const ogUrl = metaPattern('property', 'og:url')
  html = swap(html, canonical, seo.canonical ? `<link rel="canonical" href="${escAttr(seo.canonical)}" />` : '', 'canonical')
  html = swap(html, ogUrl, seo.canonical ? `<meta property="og:url" content="${escAttr(seo.canonical)}" />` : '', 'og:url')

  if (seo.jsonLd) {
    // "<" is escaped so copy can never close the script tag early.
    const json = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')
    html = swap(html, /<\/head>/, `<script type="application/ld+json" data-page-jsonld="true">${json}</script>\n</head>`, '</head>')
  }

  return swap(html, /<div id="root"><\/div>/, `<div id="root" data-prerendered="${escAttr(marker)}">${appHtml}</div>`, '#root')
}
