Cypress.Commands.add('resetVisitorState', () => {
  cy.clearLocalStorage('simplex_visitor_path')
  cy.clearLocalStorage('simplex_visitor_path_expiry')
})

Cypress.Commands.add('seedPath', (pathId) => {
  const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000
  cy.window().then((win) => {
    win.localStorage.setItem('simplex_visitor_path', pathId)
    win.localStorage.setItem('simplex_visitor_path_expiry', String(expiry))
  })
})

Cypress.Commands.add('completeModal', ({ who = 'parent', school = 'high', concern = 'struggling' } = {}) => {
  if (who === 'student') {
    cy.get('[data-cy="modal-option-student"]').click()
    return
  }
  cy.get('[data-cy="modal-option-parent"]').click()
  cy.get(`[data-cy="modal-option-${school}"]`).click()
  cy.get(`[data-cy="modal-concern-${concern}"]`).click()
})

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

Cypress.Commands.add('fillCallbackForm', ({
  name = 'Test Parent',
  phone = '0412 345 678',
  yearLevel = 'Year 9',
  time = 'Morning (8am–12pm)',
  notes = '',
} = {}) => {
  cy.get('[data-cy="form-name"]').clear().type(name)
  cy.get('[data-cy="form-phone"]').clear().type(phone)
  cy.get('[data-cy="form-year-level"]').select(yearLevel)
  cy.contains('[data-cy^="form-time-btn"]', time).click()
  if (notes) cy.get('[data-cy="form-notes"]').type(notes)
})
