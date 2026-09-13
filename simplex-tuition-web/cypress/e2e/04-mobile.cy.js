const MOBILE = { viewportWidth: 390, viewportHeight: 844 }

describe('Mobile — Home', MOBILE, () => {
  beforeEach(() => cy.visit('/'))

  it('headline is visible without scrolling', () => {
    cy.get('[data-cy="hero-headline"]').should('be.visible')
  })

  it('page never scrolls sideways', () => {
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(390)
    })
  })

  it('sticky bar stays hidden while a form is on screen, then appears', () => {
    cy.get('[data-cy="mobile-bar"]').should('not.have.class', 'show')
    cy.get('[data-cy="two-doors"]').scrollIntoView()
    cy.get('[data-cy="mobile-bar"]').should('have.class', 'show')
    cy.get('[data-cy="lead-form-final"]').scrollIntoView()
    cy.get('[data-cy="mobile-bar"]').should('not.have.class', 'show')
  })

  it('form submits on mobile', () => {
    cy.stubFormspreeSuccess()
    cy.fillLeadForm('hero')
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit')
    cy.url().should('include', '/thank-you')
  })
})
