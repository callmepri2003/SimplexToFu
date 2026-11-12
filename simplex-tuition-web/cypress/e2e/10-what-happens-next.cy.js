const MOBILE = { viewportWidth: 390, viewportHeight: 844 }
const PAGE = '/what-happens-next'

// Where the Meta instant form sends a parent after she submits. She arrives on her phone, number
// already given, with the question "what did I just sign up for?"
describe('What happens next — after the instant form, on a phone', MOBILE, () => {
  // The pixel snippet in index.html keeps an fbq that is already there, so a stub set before
  // the page loads records every pixel call without anything reaching Meta.
  const visit = () => cy.visit(PAGE, { onBeforeLoad(win) { win.fbq = cy.stub().as('fbq') } })

  it('says what happens next in the first screen, and never scrolls sideways', () => {
    visit()
    cy.get('[data-cy="hero-headline"]').should('be.visible').and('contain', 'what happens next')
    cy.contains('[data-cy="nx-hero"]', 'call you today').should('be.visible')
    cy.get('[data-cy="nx-whatsapp"]').then(($a) => expect($a[0].getBoundingClientRect().bottom, 'WhatsApp button is in the first screen').to.be.at.most(844))
    cy.document().then((doc) => expect(doc.documentElement.scrollWidth).to.be.at.most(390))
  })

  it('asks for nothing new: no form, no booking button, no sticky bar, no header phone', () => {
    visit()
    cy.get('main form').should('not.exist')
    cy.get('.site-header .nav-cta').should('not.exist')
    cy.get('[data-cy="mobile-bar"]').should('not.exist')
    cy.contains('a, button', /book a free lesson/i).should('not.exist')
  })

  it('follows the brand rules: one swipe, in the headline, which is not a question; no price', () => {
    visit()
    cy.get('main .hl').should('have.length', 1)
    cy.get('h1 .hl').should('exist')
    cy.get('h1').invoke('text').should('not.contain', '?')
    cy.get('main').invoke('text').should('not.match', /\$\s?\d/)
  })

  it('lets the keen parent sort the time out now on WhatsApp, or call', () => {
    visit()
    cy.get('[data-cy="nx-whatsapp"]')
      .should('have.attr', 'href')
      .and('match', /^https:\/\/wa\.me\/61452330300\?text=/)
      .and('contain', encodeURIComponent('free maths diagnostic'))
    cy.get('[data-cy="nx-whatsapp"]').should('have.attr', 'target', '_blank')
    cy.get('[data-cy="nx-phone"]').should('have.attr', 'href', 'tel:+61452330300')
    cy.get('[data-cy="nx-whatsapp-final"]').should('exist')
  })

  it('shows the hour and the clip from the ad, and says where it happens', () => {
    visit()
    cy.get('[data-cy="nx-clip"]').should('have.attr', 'poster', '/video/follow-the-line-poster.jpg').and('have.attr', 'muted')
    cy.get('[data-cy="nx-hour"] .gw-step-item').should('have.length', 3)
    cy.get('[data-cy="nx-ready"]').should('contain', '27 Carnamah Rd, Austral')
    cy.get('[data-cy="faq"] details').should('have.length.greaterThan', 2)
  })

  it('tells the pixel she kept reading (ViewContent), and stays out of search', () => {
    visit()
    cy.get('@fbq').should('have.been.calledWith', 'track', 'ViewContent', Cypress.sinon.match({ content_name: 'what-happens-next' }))
    cy.get('head meta[name="robots"]').should('have.attr', 'content').and('contain', 'noindex')
    cy.title().should('contain', 'what happens next')
  })

  it('a WhatsApp tap is Contact, never Lead: the lead was already counted by the form', () => {
    visit()
    cy.get('[data-cy="nx-whatsapp"]').invoke('removeAttr', 'target').invoke('attr', 'href', '#').click()
    cy.get('@fbq').should('have.been.calledWith', 'track', 'Contact')
    cy.get('@fbq').should('not.have.been.calledWith', 'track', 'Lead')
  })
})
