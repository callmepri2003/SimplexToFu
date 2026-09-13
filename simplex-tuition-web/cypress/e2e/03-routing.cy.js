describe('Routing', () => {
  it('/ loads the home page', () => {
    cy.visit('/')
    cy.get('[data-cy="hero-headline"]').should('be.visible')
  })

  it('/tutoring lists every suburb', () => {
    cy.visit('/tutoring')
    cy.get('[data-cy="suburb-list"] .loc-card').should('have.length', 8)
  })

  it('/tutoring/:suburb renders the local page', () => {
    cy.visit('/tutoring/leppington')
    cy.get('[data-cy="hero-headline"]').should('contain.text', 'Leppington')
    cy.get('[data-cy="local-note"]').should('contain.text', 'Leppington Public School')
    cy.title().should('include', 'Leppington')
  })

  it('suburb form sends the suburb with the lead', () => {
    cy.intercept('POST', '**/formspree.io/**', (req) => {
      expect(req.body.suburb).to.equal('Edmondson Park')
      expect(req.body.form_location).to.equal('suburb-hero')
      req.reply({ statusCode: 200, body: { ok: true } })
    }).as('suburbLead')
    cy.visit('/tutoring/edmondson-park')
    cy.fillLeadForm('suburb-hero')
    cy.get('[data-cy="lead-form-suburb-hero"] [data-cy="form-submit"]').click()
    cy.wait('@suburbLead')
    cy.url().should('include', '/thank-you')
  })

  it('an unknown suburb redirects to /tutoring', () => {
    cy.visit('/tutoring/nowhere')
    cy.url().should('match', /\/tutoring$/)
  })

  it('retired /diagnostic sends visitors home', () => {
    cy.visit('/diagnostic')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('/thank-you loads and links back home', () => {
    cy.visit('/thank-you')
    cy.get('[data-cy="thank-you-page"]').should('be.visible')
    cy.contains('Back to home').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
