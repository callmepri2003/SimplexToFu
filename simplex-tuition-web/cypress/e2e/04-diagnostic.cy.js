describe('Diagnostic Offer — Post-Form', () => {
  beforeEach(() => {
    cy.resetVisitorState()
    cy.seedPath('struggling')
    cy.stubFormspreeSuccess()
    cy.visit('/')
    cy.fillCallbackForm()
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit')
  })

  it('skip button navigates to /thank-you', () => {
    cy.get('[data-cy="diagnostic-offer-skip"]').click()
    cy.url().should('include', '/thank-you')
  })

  it('yes button navigates to /diagnostic with path param', () => {
    cy.get('[data-cy="diagnostic-offer-yes"]').click()
    cy.url().should('include', '/diagnostic')
    cy.url().should('include', 'path=struggling')
  })
})

describe('Diagnostic Flow — Full journey (maths, high school)', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/formspree.io/**', { statusCode: 200, body: { ok: true } }).as('formspreeSubmit')
    cy.visit('/diagnostic?path=struggling')
  })

  it('completes all 8 questions and shows complete screen', () => {
    cy.get('[data-cy="diagnostic-start"]').click()
    cy.get('[data-cy="diagnostic-handoff-confirm"]').click()
    for (let i = 0; i < 8; i++) {
      cy.get('[data-cy^="question-option-"]').first().click()
      cy.wait(450)
    }
    cy.get('[data-cy="diagnostic-complete"]').should('be.visible')
  })

  it('sends results to Formspree on completion', () => {
    cy.get('[data-cy="diagnostic-start"]').click()
    cy.get('[data-cy="diagnostic-handoff-confirm"]').click()
    for (let i = 0; i < 8; i++) {
      cy.get('[data-cy^="question-option-"]').first().click()
      cy.wait(450)
    }
    cy.wait('@formspreeSubmit').its('request.body').then((body) => {
      expect(body).to.have.property('subject')
      expect(body).to.have.property('score')
      expect(body).to.have.property('path', 'struggling')
    })
  })
})

describe('Diagnostic — Formspree failure is silent', () => {
  it('complete screen still shows when Formspree is down', () => {
    cy.intercept('POST', '**/formspree.io/**', { statusCode: 500 })
    cy.visit('/diagnostic?path=struggling')
    cy.get('[data-cy="diagnostic-start"]').click()
    cy.get('[data-cy="diagnostic-handoff-confirm"]').click()
    for (let i = 0; i < 8; i++) {
      cy.get('[data-cy^="question-option-"]').first().click()
      cy.wait(450)
    }
    cy.get('[data-cy="diagnostic-complete"]').should('be.visible')
    cy.get('[data-cy="form-error"]').should('not.exist')
  })
})
