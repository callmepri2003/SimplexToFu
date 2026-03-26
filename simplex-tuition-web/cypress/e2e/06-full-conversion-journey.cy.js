describe('Full Conversion Journey — Worried Parent', () => {
  it('completes the full parent journey end to end', () => {
    cy.resetVisitorState()
    cy.visit('/')

    // Step 1 — modal shown
    cy.get('[data-cy="welcome-modal"]').should('be.visible')

    // Step 2 — select path
    cy.get('[data-cy="modal-option-parent"]').click()
    cy.get('[data-cy="modal-option-high"]').click()
    cy.get('[data-cy="modal-concern-struggling"]').click()
    cy.get('[data-cy="welcome-modal"]').should('not.exist')

    // Step 3 — hero personalised
    cy.get('[data-cy="hero-headline"]').should('contain.text', "isn't behind")

    // Step 4 — proof visible
    cy.contains('37%').should('be.visible')
    cy.contains('76%').should('be.visible')

    // Step 5 — form submits
    cy.intercept('POST', '**/formspree.io/**', { statusCode: 200, body: { ok: true } }).as('formspreeSubmit')
    cy.fillCallbackForm({ name: 'Sarah Johnson', phone: '0412 345 678', yearLevel: 'Year 9', time: 'Afternoon (12pm–5pm)' })
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit')
    cy.get('[data-cy="diagnostic-offer-yes"]').should('be.visible')

    // Step 6 — navigate to diagnostic
    cy.get('[data-cy="diagnostic-offer-yes"]').click()
    cy.url().should('include', '/diagnostic')

    // Step 7 — complete diagnostic
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
    cy.visit('/')

    // Select student path in one click
    cy.get('[data-cy="modal-option-student"]').click()
    cy.get('[data-cy="welcome-modal"]').should('not.exist')

    // Hero is student-specific
    cy.get('[data-cy="hero-headline"]').should('contain.text', 'Actually understand it')

    // Submit form and skip diagnostic
    cy.intercept('POST', '**/formspree.io/**', { statusCode: 200, body: { ok: true } }).as('formspreeSubmit')
    cy.fillCallbackForm()
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit')
    cy.get('[data-cy="diagnostic-offer-skip"]').click()
    cy.url().should('include', '/thank-you')
  })
})
