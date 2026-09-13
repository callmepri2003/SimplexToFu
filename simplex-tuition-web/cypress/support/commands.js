Cypress.Commands.add('stubFormspreeSuccess', () => {
  cy.intercept('POST', '**/formspree.io/**', {
    statusCode: 200, body: { ok: true },
  }).as('formspreeSubmit')
})

Cypress.Commands.add('stubFormspreeFailure', () => {
  cy.intercept('POST', '**/formspree.io/**', {
    statusCode: 500, body: { error: 'Internal Server Error' },
  }).as('formspreeError')
})

// Fills the lead form identified by its location ("hero", "final", ...).
Cypress.Commands.add('fillLeadForm', (location = 'hero', {
  name = 'Test Parent',
  phone = '0412 345 678',
  yearLevel = 'Year 5',
  concern = null,
} = {}) => {
  cy.get(`[data-cy="lead-form-${location}"]`).within(() => {
    cy.get('[data-cy="form-name"]').clear().type(name)
    cy.get('[data-cy="form-phone"]').clear().type(phone)
    cy.get('[data-cy="form-year-level"]').select(yearLevel)
    if (concern) cy.get(`[data-cy="form-concern-${concern}"]`).click()
  })
})
