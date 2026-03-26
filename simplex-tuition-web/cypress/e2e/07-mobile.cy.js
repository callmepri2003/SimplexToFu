const MOBILE = { viewportWidth: 390, viewportHeight: 844 }

describe('Mobile — Welcome Modal', MOBILE, () => {
  beforeEach(() => { cy.resetVisitorState(); cy.visit('/') })

  it('modal is fully visible on mobile', () => {
    cy.get('[data-cy="welcome-modal"]').should('be.visible')
    cy.get('[data-cy="modal-option-parent"]').should('be.visible')
  })

  it('full parent path completes on mobile', () => {
    cy.completeModal({ who: 'parent', school: 'primary', concern: 'assessment' })
    cy.get('[data-cy="welcome-modal"]').should('not.exist')
    cy.get('[data-cy="hero-headline"]').should('be.visible')
  })
})

describe('Mobile — Callback Form', MOBILE, () => {
  beforeEach(() => {
    cy.resetVisitorState()
    cy.seedPath('struggling')
    cy.stubFormspreeSuccess()
    cy.visit('/')
  })

  it('form submits successfully on mobile', () => {
    cy.fillCallbackForm()
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit')
    cy.get('[data-cy="diagnostic-offer-yes"]').should('be.visible')
  })
})

describe('Mobile — Diagnostic', MOBILE, () => {
  beforeEach(() => {
    cy.intercept('POST', '**', { statusCode: 200, body: { ok: true } })
    cy.visit('/diagnostic?path=struggling')
  })

  it('diagnostic question options are tappable on mobile', () => {
    cy.get('[data-cy="diagnostic-start"]').click()
    cy.get('[data-cy="diagnostic-handoff-confirm"]').click()
    cy.get('[data-cy^="question-option-"]').first().should('be.visible').click()
    cy.get('[data-cy="diagnostic-counter"]').should('contain.text', '2')
  })
})
