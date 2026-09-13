const GBP = '/?utm_source=google&utm_medium=organic&utm_campaign=gbp'

describe('Lead attribution', () => {
  beforeEach(() => cy.clearLocalStorage())

  it('a Google Business Profile visit is credited on the lead, even after browsing', () => {
    cy.intercept('POST', '**/formspree.io/**', (req) => {
      expect(req.body.channel).to.equal('Google')
      expect(req.body.channel_detail).to.equal('Google Business Profile')
      expect(req.body.utm_campaign).to.equal('gbp')
      expect(req.body.landing_page).to.equal(GBP)
      expect(req.body._subject).to.include('Google Business Profile')
      req.reply({ statusCode: 200, body: { ok: true } })
    }).as('lead')

    cy.visit(GBP)
    // Parent comes back later by typing the address: GBP keeps the credit.
    cy.visit('/tutoring/leppington')
    cy.fillLeadForm('suburb-hero')
    cy.get('[data-cy="lead-form-suburb-hero"] [data-cy="form-submit"]').click()
    cy.wait('@lead')
  })

  it('a direct visit is labelled Other so the sheet stays valid', () => {
    cy.intercept('POST', '**/formspree.io/**', (req) => {
      expect(req.body.channel).to.equal('Other')
      expect(req.body.channel_detail).to.match(/^Direct/)
      req.reply({ statusCode: 200, body: { ok: true } })
    }).as('lead')
    cy.visit('/')
    cy.fillLeadForm('hero')
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-submit"]').click()
    cy.wait('@lead')
  })

  it('sends the lead to the Enquiries sheet when the webhook is configured', function () {
    if (!Cypress.env('ENQUIRIES_WEBHOOK')) this.skip()
    cy.stubFormspreeSuccess()
    cy.intercept('POST', '**/script.google.com/**', (req) => {
      const body = JSON.parse(req.body)
      expect(body).to.include({ name: 'Nadia', channel: 'Google', channelDetail: 'Google Business Profile', yearLevel: 'Year 5', formLocation: 'hero' })
      expect(body.token).to.equal('e2e-token')
      req.reply({ statusCode: 200, body: '{"ok":true}' })
    }).as('sheet')
    cy.visit(GBP)
    cy.fillLeadForm('hero', { name: 'Nadia' })
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-submit"]').click()
    cy.wait('@sheet')
    cy.url().should('include', '/thank-you')
  })

  it('a bot filling the honeypot is not sent to the sheet', function () {
    if (!Cypress.env('ENQUIRIES_WEBHOOK')) this.skip()
    cy.stubFormspreeSuccess()
    cy.intercept('POST', '**/script.google.com/**', cy.spy().as('sheet'))
    cy.visit('/')
    cy.fillLeadForm('hero')
    cy.get('[data-cy="lead-form-hero"] input[name="_gotcha"]').type('bot', { force: true })
    cy.get('[data-cy="lead-form-hero"] [data-cy="form-submit"]').click()
    cy.wait('@formspreeSubmit').its('request.body._gotcha').should('equal', 'bot')
    cy.url().should('include', '/thank-you')
    cy.get('@sheet').should('not.have.been.called')
  })

  it('route changes are reported as page views', () => {
    cy.visit('/')
    cy.get('footer').contains('Leppington').click()
    // gtag() pushes its arguments onto dataLayer; the real library is blocked in tests.
    cy.window().its('dataLayer').should((layer) => {
      const pv = layer.map((e) => Array.from(e)).find((e) => e[0] === 'event' && e[1] === 'page_view')
      expect(pv, 'page_view sent').to.exist
      expect(pv[2].page_location).to.include('/tutoring/leppington')
      expect(pv[2].page_title).to.include('Leppington')
    })
  })
})
