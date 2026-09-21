// Runs after `vite build` and the SSR build (see "build" in package.json).
// Turns the single-page shell in dist/ into one static HTML file per route, so
// crawlers and link previews that never run JavaScript still get each page's
// own content, title, canonical and JSON-LD. Also writes 404.html and sitemap.xml.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const ssrDir = new URL('../dist-ssr/', import.meta.url)
const { render, applySeo, seoForPath, sitemapXml, PRERENDER_PATHS } = await import(new URL('entry-server.js', ssrDir))

// Read the shell once, before the home page overwrites dist/index.html.
const template = await readFile(`${dist}index.html`, 'utf8')

async function writePage(path, file, marker) {
  const html = applySeo(template, { seo: seoForPath(path), appHtml: render(path), marker })
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
}

// /tutoring/prestons -> tutoring/prestons.html. Vercel (cleanUrls) and `vite
// preview` both serve that file at the extensionless URL.
for (const path of PRERENDER_PATHS) {
  await writePage(path, path === '/' ? `${dist}index.html` : `${dist}${path.slice(1)}.html`, path)
}
// Vercel serves 404.html, with a 404 status, for any URL that isn't a file.
await writePage('/404', `${dist}404.html`, '404')

await writeFile(`${dist}sitemap.xml`, sitemapXml(new Date().toISOString().slice(0, 10)))
await rm(ssrDir, { recursive: true, force: true })

console.log(`prerendered ${PRERENDER_PATHS.length} pages, 404.html and sitemap.xml`)
