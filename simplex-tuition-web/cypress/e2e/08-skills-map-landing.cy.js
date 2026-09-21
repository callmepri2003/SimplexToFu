const MOBILE = { viewportWidth: 390, viewportHeight: 844 }
const LANDING = '/maths-map'
const MAP = '/maths-map/open'

const stubSignup = (check = () => {}) => cy.intercept('POST', '**/formspree.io/**', (req) => {
  check(req.body)
  req.reply({ statusCode: 200, body: { ok: true } })
}).as('signup')

describe('Maths skills map landing — a parent arriving from a post on her phone', MOBILE, () => {
  beforeEach(() => cy.visit(LANDING))

  it('asks for the email in the first screen, and never scrolls sideways', () => {
    cy.get('[data-cy="hero-headline"]').should('be.visible')
    cy.get('[data-cy="map-form-map-hero"] [data-cy="map-submit"]').then(($b) => {
      expect($b[0].getBoundingClientRect().bottom, 'button is in the first screen').to.be.at.most(844)
    })
    cy.document().then((doc) => expect(doc.documentElement.scrollWidth).to.be.at.most(390))
  })

  it('has one job: no booking button, no phone number, no sticky bar competing with the email', () => {
    cy.get('.site-header .nav-cta').should('not.exist')
    cy.get('[data-cy="mobile-bar"]').should('not.exist')
    cy.contains('a, button', /book a free lesson/i).should('not.exist')
  })

  it('follows the brand rules: one highlighter swipe, in the headline, and no question there', () => {
    cy.get('main .hl').should('have.length', 1)
    cy.get('h1 .hl').should('exist')
    cy.get('h1').invoke('text').should('not.contain', '?')
  })

  it('lets her tap a topic and see how far back it goes, with real numbers', () => {
    cy.get('[data-cy="map-strip"]').should('contain', 'Algebra depends on').and('contain', 'earlier skills') // one is chosen on arrival
    cy.get('[data-cy="map-topic-M-78-10"]').click().should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-cy="map-strip"]').should('contain', 'Equations depends on').and('contain', 'Kindergarten to Year 2')
    cy.get('[data-cy="map-strip"] .map-hidden').should('have.length.greaterThan', 1) // most skills stay covered until the map is open
    cy.get('[data-cy="map-form-map-try"] [data-cy="map-submit"]').invoke('text').should('match', /^Show me all \d+ skills/)
  })

  it('takes an email, remembers the topic, and opens the map on that topic’s path', () => {
    stubSignup((body) => {
      expect(body.email).to.eq('nadia@example.com')
      expect(body.offer).to.eq('skills-map')
      expect(body.form_location).to.eq('map-try')
      expect(body.stuck_on).to.eq('Solving equations')
      expect(body._subject).to.contain('Skills map sign-up').and.to.contain('nadia@example.com')
      expect(body).to.have.property('channel') // attribution travels with the sign-up, as it does with a lead
    })
    cy.get('[data-cy="map-topic-M-78-10"]').click()
    cy.get('[data-cy="map-form-map-try"]').within(() => {
      cy.get('[data-cy="map-email"]').type('nadia@example.com')
      cy.get('[data-cy="map-submit"]').click()
    })
    cy.wait('@signup')
    cy.location('pathname').should('eq', MAP)
    cy.location('hash').should('eq', '#path=M-78-10')
    cy.get('.vc-card', { timeout: 15000 }).should('have.length.lessThan', 60)
    cy.contains('.vc-card--focus', 'Solving equations').should('be.visible')
  })

  it('will not send without an email', () => {
    cy.intercept('POST', '**/formspree.io/**', cy.spy().as('post'))
    cy.get('[data-cy="map-form-map-hero"] [data-cy="map-submit"]').click()
    cy.get('@post').should('not.have.been.called')
    cy.location('pathname').should('eq', LANDING)
  })

  it('still lets her in if our form service is down: she came for the map', () => {
    cy.intercept('POST', '**/formspree.io/**', { statusCode: 500, body: {} }).as('down')
    cy.get('[data-cy="map-form-map-hero"]').within(() => {
      cy.get('[data-cy="map-email"]').type('nadia@example.com')
      cy.get('[data-cy="map-submit"]').click()
    })
    cy.wait('@down')
    cy.location('pathname').should('eq', MAP)
  })

  it('a parent who already has the map is offered the way in, not the form again', () => {
    stubSignup()
    cy.get('[data-cy="map-form-map-hero"] [data-cy="map-email"]').type('nadia@example.com{enter}')
    cy.wait('@signup')
    cy.location('pathname').should('eq', MAP)
    cy.visit(LANDING)
    cy.get('[data-cy="map-form-map-hero"] [data-cy="map-email"]').should('not.exist')
    cy.get('[data-cy="map-form-map-hero"] [data-cy="map-open"]').should('contain', 'Open the skills map')
  })
})

describe('Maths skills map — the email comes first', MOBILE, () => {
  it('sends a visitor without access to the landing page, then back to the exact skill they wanted', () => {
    stubSignup()
    cy.visit(`${MAP}#path=M-56-10`)
    cy.location('pathname').should('eq', LANDING)
    cy.location('search').should('contain', 'next=')
    cy.get('[data-cy="map-form-map-hero"] [data-cy="map-email"]').type('nadia@example.com{enter}')
    cy.wait('@signup')
    cy.location('pathname').should('eq', MAP)
    cy.location('hash').should('eq', '#path=M-56-10')
    cy.contains('.vc-card--focus', 'Fraction of a quantity', { timeout: 15000 }).should('be.visible')
  })

  it('a link from a tutor opens the map for a family without the email step', () => {
    cy.visit(`${MAP}?pass=family#path=M-56-10`)
    cy.location('pathname').should('eq', MAP)
    cy.get('.vc-card', { timeout: 15000 }).should('exist')
  })

  it('ignores a `next` that points anywhere but the map', () => {
    stubSignup()
    cy.visit(`${LANDING}?next=${encodeURIComponent('//example.com')}`)
    cy.get('[data-cy="map-form-map-hero"] [data-cy="map-email"]').type('nadia@example.com{enter}')
    cy.wait('@signup')
    cy.location('pathname').should('eq', MAP)
    cy.location('hostname').should('eq', 'localhost')
  })
})

const prerendered = Cypress.env('PRERENDERED') ? describe : describe.skip

prerendered('Maths skills map landing — prerendered HTML', () => {
  it('gives crawlers and link previews the page’s own head and its words', () => {
    cy.request(LANDING).its('body').should((html) => {
      expect(html).to.contain('<title>What Your Child Should Know in Maths, Year by Year | Free NSW Skills Map</title>')
      expect(html).to.contain('<link rel="canonical" href="https://simplextuition.com.au/maths-map" />')
      expect(html).to.contain('The report says what. It never says which work.')
      expect(html).to.contain('data-cy="map-email"') // the form is in the HTML, not waiting on JavaScript
    })
  })
})
