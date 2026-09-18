describe('Lead form — happy path', () => {
  beforeEach(() => {
    cy.stubFormspreeSuccess()
    cy.visit('/')
  })

  it('hero form submits and lands on /thank-you', () => {
    cy.fillLeadForm('hero')
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit')
    cy.url().should('include', '/thank-you')
    cy.get('[data-cy="thank-you-page"]').should('be.visible')
  })

  it('POSTs the lead, the concern and where the form was', () => {
    cy.intercept('POST', '**/formspree.io/**', (req) => {
      expect(req.body.name).to.equal('Nadia')
      expect(req.body.phone).to.equal('0412 999 888')
      expect(req.body.yearLevel).to.equal('Year 6')
      expect(req.body.concern).to.equal('The school said something')
      expect(req.body.form_location).to.equal('final')
      req.reply({ statusCode: 200, body: { ok: true } })
    }).as('fullCheck')
    cy.fillLeadForm('final', { name: 'Nadia', phone: '0412 999 888', yearLevel: 'Year 6', concern: 'school-said' })
    cy.get('[data-cy="lead-form-final"] [data-cy="form-submit"]').click()
    cy.wait('@fullCheck')
  })

  it('concern is optional', () => {
    cy.intercept('POST', '**/formspree.io/**', (req) => {
      expect(req.body.concern).to.equal('')
      req.reply({ statusCode: 200, body: { ok: true } })
    }).as('noConcern')
    cy.fillLeadForm('hero')
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-submit"]').click()
    cy.wait('@noConcern')
  })
})

describe('Lead form — validation and errors', () => {
  it('does not send when required fields are empty', () => {
    cy.intercept('POST', '**/formspree.io/**', cy.spy().as('post'))
    cy.visit('/')
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-submit"]').click()
    cy.get('@post').should('not.have.been.called')
    cy.url().should('not.include', '/thank-you')
  })

  it('shows an error and lets the parent retry', () => {
    cy.stubFormspreeFailure()
    cy.visit('/')
    cy.fillLeadForm('hero')
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-submit"]').click()
    cy.wait('@formspreeError')
    cy.get('[data-cy="form-error"]').should('be.visible').and('contain.text', '0452 330 300')

    cy.stubFormspreeSuccess()
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit')
    cy.url().should('include', '/thank-you')
  })
})
