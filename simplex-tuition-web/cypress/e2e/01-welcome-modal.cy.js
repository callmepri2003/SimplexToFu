describe('Welcome Modal — First Visit', () => {
  beforeEach(() => { cy.resetVisitorState(); cy.visit('/') })

  it('shows the modal on first visit', () => {
    cy.get('[data-cy="welcome-modal"]').should('be.visible')
  })

  it('does not show the modal on second visit after selecting a path', () => {
    cy.completeModal({ who: 'parent', school: 'high', concern: 'struggling' })
    cy.get('[data-cy="welcome-modal"]', { timeout: 2000 }).should('not.exist')
    cy.reload()
    cy.get('[data-cy="welcome-modal"]').should('not.exist')
  })

  it('student path completes in one click', () => {
    cy.get('[data-cy="modal-option-student"]').click()
    cy.get('[data-cy="welcome-modal"]', { timeout: 2000 }).should('not.exist')
  })
})

describe('Welcome Modal — Returning Visit', () => {
  it('skips modal when a valid non-expired path is in localStorage', () => {
    cy.resetVisitorState()
    cy.visit('/')
    cy.seedPath('ahead')
    cy.reload()
    cy.get('[data-cy="welcome-modal"]').should('not.exist')
  })

  it('shows modal again when the stored path has expired', () => {
    cy.resetVisitorState()
    cy.window().then((win) => {
      win.localStorage.setItem('simplex_visitor_path', 'struggling')
      win.localStorage.setItem('simplex_visitor_path_expiry', String(Date.now() - 1000))
    })
    cy.visit('/')
    cy.get('[data-cy="welcome-modal"]').should('be.visible')
  })
})
