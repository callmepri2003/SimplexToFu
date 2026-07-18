describe('Full Conversion Journey — Worried Parent', () => {
  it('completes the full parent journey end to end', () => {
    cy.resetVisitorState()
    cy.seedPath('struggling')
    cy.visit('/')

    // Hero is personalised for the struggling path
    cy.get('[data-cy="hero-headline"]').should('contain.text', "isn't behind")

    // Proof is visible
    cy.contains('37%').should('be.visible')
    cy.contains('76%').should('be.visible')

    // Form submits
    cy.intercept('POST', '**/formspree.io/**', { statusCode: 200, body: { ok: true } }).as('formspreeSubmit')
    cy.fillCallbackForm({ name: 'Sarah Johnson', phone: '0412 345 678', yearLevel: 'Year 9', time: 'Afternoon (12pm–5pm)' })
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit')
    cy.get('[data-cy="diagnostic-offer-yes"]').should('be.visible')

    // Navigate to diagnostic
    cy.get('[data-cy="diagnostic-offer-yes"]').click()
    cy.url().should('include', '/diagnostic')

    // Complete diagnostic
    cy.intercept('POST', '**', { statusCode: 200, body: { ok: true } })
    cy.get('[data-cy="diagnostic-start"]').click()
    cy.get('[data-cy="diagnostic-handoff-confirm"]').click()
    for (let i = 0; i < 8; i++) {
      cy.get('[data-cy^="question-option-"]').first().click()
      cy.wait(450)
    }
    cy.get('[data-cy="diagnostic-complete"]').should('be.visible')
  })
})

describe('Full Conversion Journey — Student, Skip Diagnostic', () => {
  it('completes the full student journey end to end', () => {
    cy.resetVisitorState()
    cy.seedPath('student')
    cy.visit('/')

    cy.get('[data-cy="hero-headline"]').should('contain.text', 'Actually understand it')

    cy.intercept('POST', '**/formspree.io/**', { statusCode: 200, body: { ok: true } }).as('formspreeSubmit')
    cy.fillCallbackForm()
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit')
    cy.get('[data-cy="diagnostic-offer-skip"]').click()
    cy.url().should('include', '/thank-you')
  })
})
