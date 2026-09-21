const ORIGIN = 'https://simplextuition.com.au'

const businesses = ($scripts) =>
  [...$scripts].flatMap((s) => JSON.parse(s.textContent)['@graph']).filter((n) => [].concat(n['@type']).includes('LocalBusiness'))

const expectHead = ({ title, canonical }) => {
  cy.title().should('include', title)
  cy.get('head link[rel="canonical"]').should('have.length', 1).and('have.attr', 'href', canonical)
  cy.get('head meta[property="og:url"]').should('have.attr', 'content', canonical)
  cy.get('head meta[name="robots"]').should('have.attr', 'content', 'index, follow')
  cy.get('head script[type="application/ld+json"]').should(($s) => {
    expect($s, 'JSON-LD blocks').to.have.length(1)
    expect(businesses($s).map((b) => b['@id']), 'business entities').to.deep.equal([`${ORIGIN}/#business`])
  })
}

describe('SEO head', () => {
  it('home, hub and suburb pages each describe themselves', () => {
    cy.visit('/')
    expectHead({ title: 'Simplex Tuition', canonical: `${ORIGIN}/` })
    cy.visit('/tutoring')
    expectHead({ title: 'South-West Sydney', canonical: `${ORIGIN}/tutoring` })
    cy.visit('/tutoring/carnes-hill')
    expectHead({ title: 'Carnes Hill', canonical: `${ORIGIN}/tutoring/carnes-hill` })
  })

  it('follows client-side navigation from the home page to a suburb and back', () => {
    cy.visit('/')
    cy.get('footer').contains('a', 'Prestons').click()
    cy.get('[data-cy="hero-headline"]').should('contain.text', 'Prestons')
    expectHead({ title: 'Prestons', canonical: `${ORIGIN}/tutoring/prestons` })
    cy.go('back')
    expectHead({ title: 'Simplex Tuition', canonical: `${ORIGIN}/` })
  })

  it('keeps /thank-you out of the index', () => {
    cy.visit('/thank-you')
    cy.get('head meta[name="robots"]').should('have.attr', 'content', 'noindex, follow')
    cy.get('head link[rel="canonical"]').should('not.exist')
    cy.get('head script[type="application/ld+json"]').should('not.exist')
  })

  it('offers smaller WebP lesson photos, with the JPEG as fallback', () => {
    cy.visit('/')
    cy.get('[data-cy="lesson-photos"] picture').should('have.length', 4).first().within(() => {
      cy.get('source[type="image/webp"]').should('have.attr', 'srcset').and('match', /-400\.webp 400w, .*-800\.webp 800w/)
      cy.get('img').should('have.attr', 'src').and('match', /\.jpg$/)
    })
    cy.request('/photos/writing-400.webp').its('headers.content-type').should('eq', 'image/webp')
  })
})

// The raw HTML a crawler without JavaScript receives. Only the built site
// (npm run build && npm run preview) is prerendered; CI sets CYPRESS_PRERENDERED.
const prerendered = Cypress.env('PRERENDERED') ? describe : describe.skip

prerendered('Prerendered HTML', () => {
  it('serves each page’s own content and head without JavaScript', () => {
    cy.request('/tutoring/leppington').its('body').should((html) => {
      expect(html).to.contain('<title>Maths &amp; English Tutoring in Leppington | Simplex Tuition</title>')
      expect(html).to.contain(`<link rel="canonical" href="${ORIGIN}/tutoring/leppington" />`)
      expect(html).to.contain('Leppington Public School')
      expect(html).to.match(/<h1[^>]*>Maths &amp; English tutoring in /)
    })
    cy.request('/').its('body').should((html) => {
      expect(html).to.contain(`<link rel="canonical" href="${ORIGIN}/" />`)
      expect(html).to.contain('data-cy="faq"')
      expect(html).to.contain('"@type":"FAQPage"')
    })
  })

  it('serves robots.txt and a sitemap of the indexable pages', () => {
    cy.request('/robots.txt').should((res) => {
      expect(res.headers['content-type']).to.contain('text/plain')
      expect(res.body).to.contain(`Sitemap: ${ORIGIN}/sitemap.xml`)
    })
    cy.request('/sitemap.xml').its('body').should((xml) => {
      expect(xml.match(/<loc>/g)).to.have.length(11)
      expect(xml).to.contain(`<loc>${ORIGIN}/tutoring/liverpool</loc>`)
      expect(xml).to.contain(`<loc>${ORIGIN}/maths-map</loc>`)
      expect(xml).not.to.contain('/maths-map/open') // the map itself is exchanged for an email, so it is not indexed
      expect(xml).to.contain('<lastmod>')
      expect(xml).not.to.contain('thank-you')
    })
  })

  it('hydrates the prerendered markup without React errors', () => {
    for (const path of ['/', '/tutoring', '/tutoring/west-hoxton', '/thank-you']) {
      cy.visit(path, { onBeforeLoad: (win) => cy.stub(win.console, 'error').as(`errors:${path}`) })
      cy.get('h1').should('be.visible')
      // Hydration has happened once React has attached the form's handlers.
      if (path !== '/thank-you') cy.get('[data-cy="form-name"]').first().type('A').should('have.value', 'A')
      cy.get(`@errors:${path}`).should('not.have.been.called')
    }
  })
})
