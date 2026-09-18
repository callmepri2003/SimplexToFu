describe('Lead form — the three steps', () => {
  beforeEach(() => {
    cy.stubFormspreeSuccess()
    cy.visit('/')
  })

  it('says what it is for, then asks one question', () => {
    cy.get('[data-cy="lead-form-hero"]').should('contain.text', 'Book a free lesson')
  })

  it('opens on a question, not on a field to type in', () => {
    cy.get('[data-cy="lead-form-hero"]').should('contain.text', "So what's going wrong?")
    cy.get('[data-cy="lead-form-hero"] [data-cy^="form-concern-"]').should('have.length', 5)
    cy.get('[data-cy="lead-form-hero"] input').should('not.exist')
    cy.get('[data-cy="lead-form-hero"] select').should('not.exist')
  })

  it('says her situation back to her before asking for anything', () => {
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-concern-school-said"]').click()
    cy.get('[data-cy="form-echo"]').should('contain.text', 'most common reason')
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-year-level"]').should('be.visible')
  })

  it('mirrors a different answer differently', () => {
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-concern-cant-help"]').click()
    cy.get('[data-cy="form-echo"]').should('contain.text', 'take off you')
  })

  it('walks all three steps and lands on /thank-you', () => {
    cy.fillLeadForm('hero')
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit')
    cy.url().should('include', '/thank-you')
  })

  it('lets her go back and change her answer', () => {
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-concern-protect"]').click()
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-back"]').click()
    cy.get('[data-cy="step-concern"]').should('be.visible')
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-concern-hsc-selective"]').click()
    cy.get('[data-cy="form-echo"]').should('contain.text', 'clock matters')
    cy.get('[data-cy="lead-form-hero"]').should('contain.text', 'What year?')
  })

  it('POSTs the answer, the year and where the form was', () => {
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
})

describe('Lead form — validation and errors', () => {
  it('never hides why it will not submit', () => {
    cy.intercept('POST', '**/formspree.io/**', cy.spy().as('post'))
    cy.visit('/')
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-concern-slipping"]').click()
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-year-level"]').select('Year 4')
    // The button is always clickable; the browser flags the empty fields.
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-submit"]').should('not.be.disabled').click()
    cy.get('@post').should('not.have.been.called')
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-name"]').then(($i) => {
      expect($i[0].checkValidity()).to.equal(false)
    })
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
