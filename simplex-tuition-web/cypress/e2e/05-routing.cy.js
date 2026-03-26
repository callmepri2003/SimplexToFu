describe('Routing', () => {
  it('/ loads the home page', () => {
    cy.resetVisitorState(); cy.visit('/')
    cy.get('[data-cy="welcome-modal"]').should('be.visible')
  })

  it('/diagnostic loads the diagnostic page', () => {
    cy.visit('/diagnostic')
    cy.get('[data-cy="diagnostic-setup"]').should('be.visible')
  })

  it('/thank-you loads the thank you page', () => {
    cy.visit('/thank-you')
    cy.get('[data-cy="thank-you-page"]').should('be.visible')
  })

  it('thank-you has a back link to /', () => {
    cy.visit('/thank-you')
    cy.contains('Back to home').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
