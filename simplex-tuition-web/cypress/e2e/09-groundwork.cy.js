const MOBILE = { viewportWidth: 390, viewportHeight: 844 }
const PAGE = '/groundwork'

const stubBooking = (check = () => {}) => cy.intercept('POST', '**/formspree.io/**', (req) => {
  check(req.body)
  req.reply({ statusCode: 200, body: { ok: true } })
}).as('booking')

describe('Groundwork landing — a parent arriving from the ad on her phone', MOBILE, () => {
  beforeEach(() => cy.visit(PAGE))

  it('says it plainly in the first screen, with a button and no form, and never scrolls sideways', () => {
    cy.get('[data-cy="hero-headline"]').should('be.visible')
    cy.get('[data-cy="gw-cta-hero"]').then(($b) => {
      expect($b[0].getBoundingClientRect().bottom, 'the button is in the first screen').to.be.at.most(844)
    })
    cy.get('[data-cy="gw-hero"] form').should('not.exist')
    cy.document().then((doc) => expect(doc.documentElement.scrollWidth).to.be.at.most(390))
  })

  it('follows the brand rules: one highlighter swipe in the h1, no question there, no price, no "trial"', () => {
    cy.get('main .hl').should('have.length', 1)
    cy.get('h1 .hl').should('exist')
    cy.get('h1').invoke('text').should('not.contain', '?')
    cy.get('main').invoke('text').should('not.match', /\$\d/).and('not.match', /\btrial\b/i)
  })

  it('repeats the one CTA after every section and all of them lead to the form', () => {
    cy.get('main a[href="#book"]').should('have.length.at.least', 4)
    cy.get('#book [data-cy="groundwork-booking"]').should('exist')
  })

  it('books in five steps, lowest commitment first, and lands on the thank-you page', () => {
    stubBooking((body) => {
      expect(body.offer).to.eq('groundwork')
      expect(body.yearLevel).to.eq('Year 6')
      expect(body.child).to.eq('Yusuf')
      expect(body.name).to.eq('Nadia')
      expect(body.where).to.eq('In our home')
      expect(body.address).to.eq('12 Example Street, Austral')
      expect(body.slot_start).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:00:00[+-]\d{2}:\d{2}$/)
      expect(body.slot_label).to.match(/^(Mon|Tue|Wed|Thu|Fri|Sat) \d{1,2} \w{3}, \d{1,2}:00[ap]m$/)
    })
    cy.get('[data-cy="gw-cta-hero"]').click()
    cy.get('[data-cy="gw-step-year"] [data-cy="gw-next"]').should('be.disabled')
    cy.get('[data-cy="gw-year-year-6"]').click()
    cy.get('[data-cy="gw-step-year"] [data-cy="gw-next"]').click()
    cy.get('[data-cy="gw-child"]').type('Yusuf')
    cy.get('[data-cy="gw-step-child"] [data-cy="gw-next"]').click()
    cy.get('[data-cy="gw-parent"]').type('Nadia')
    cy.get('[data-cy="gw-step-parent"] [data-cy="gw-next"]').click()
    cy.get('[data-cy="gw-phone"]').type('0400000000')
    cy.get('[data-cy="gw-step-contact"] [data-cy="gw-next"]').click()
    cy.get('[data-cy="gw-step-when"]').contains('Yusuf’s diagnostic')
    cy.get('[data-cy="gw-where-home"]').should('have.attr', 'aria-pressed', 'true')
    // Coming to us shows our address; the tutor coming to them asks for theirs.
    cy.get('[data-cy="gw-where-centre"]').click()
    cy.get('[data-cy="gw-centre-address"]').should('contain', '27 Carnamah Rd')
    cy.get('[data-cy="gw-address"]').should('not.exist')
    cy.get('[data-cy="gw-where-home"]').click()
    cy.get('[data-cy="gw-address"]').type('12 Example Street, Austral')
    // The calendar: two weeks of days from tomorrow, no Sundays, then the hours on the chosen day.
    cy.get('[data-cy="gw-days"] .gw-day').should('have.length.at.least', 11)
    cy.get('[data-cy="gw-days"] .gw-day').contains('small', 'Sun').should('not.exist')
    cy.get('[data-cy="gw-submit"]').should('be.disabled')
    cy.get('[data-cy="gw-days"] .gw-day:not(:disabled)').eq(2).click()
    cy.get('[data-cy="gw-time"]:not(:disabled)').first().click()
    cy.get('[data-cy="gw-submit"]').should('not.be.disabled').invoke('text').should('match', /^Book (Mon|Tue|Wed|Thu|Fri|Sat) \d/)
    cy.get('[data-cy="gw-submit"]').click()
    cy.wait('@booking')
    cy.location('pathname').should('eq', '/thank-you')
    cy.get('[data-cy="thank-you-page"]').contains('Yusuf')
    cy.get('[data-cy="thank-you-when"]').invoke('text').should('match', /\d{1,2}:00[ap]m/)
    cy.get('[data-cy="thank-you-where"]').should('contain', '12 Example Street')
  })

  it('lets a parent go back without losing what she typed', () => {
    cy.get('[data-cy="gw-year-year-4"]').click()
    cy.get('[data-cy="gw-step-year"] [data-cy="gw-next"]').click()
    cy.get('[data-cy="gw-child"]').type('Amal')
    cy.get('[data-cy="gw-step-child"] [data-cy="gw-next"]').click()
    cy.get('[data-cy="gw-step-parent"] .gw-back').click()
    cy.get('[data-cy="gw-child"]').should('have.value', 'Amal')
  })
})
