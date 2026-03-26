describe('Callback Form — Happy Path', () => {
  beforeEach(() => {
    cy.resetVisitorState()
    cy.seedPath('struggling')
    cy.stubFormspreeSuccess()
    cy.visit('/')
  })

  it('submitting the form shows the diagnostic offer', () => {
    cy.fillCallbackForm()
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit')
    cy.get('[data-cy="diagnostic-offer-yes"]').should('be.visible')
    cy.get('[data-cy="form-submit"]').should('not.exist')
  })

  it('POSTs all form data to Formspree', () => {
    cy.intercept('POST', '**/formspree.io/**', (req) => {
      expect(req.body.name).to.equal('Integration Test Parent')
      expect(req.body.phone).to.equal('0412 999 888')
      expect(req.body.path).to.equal('struggling')
      req.reply({ statusCode: 200, body: { ok: true } })
    }).as('fullCheck')
    cy.fillCallbackForm({ name: 'Integration Test Parent', phone: '0412 999 888' })
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@fullCheck')
  })
})

describe('Callback Form — Error Path', () => {
  beforeEach(() => {
    cy.resetVisitorState()
    cy.seedPath('struggling')
    cy.stubFormspreeFailure()
    cy.visit('/')
  })

  it('shows error message on Formspree failure', () => {
    cy.fillCallbackForm()
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@formspreeError')
    cy.get('[data-cy="form-error"]').should('be.visible')
    cy.get('[data-cy="diagnostic-offer-yes"]').should('not.exist')
  })

  it('user can retry after failure', () => {
    cy.fillCallbackForm()
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@formspreeError')
    cy.stubFormspreeSuccess()
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit')
    cy.get('[data-cy="diagnostic-offer-yes"]').should('be.visible')
  })
})
