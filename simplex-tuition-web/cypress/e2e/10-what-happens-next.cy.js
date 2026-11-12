const MOBILE = { viewportWidth: 390, viewportHeight: 844 }
const PAGE = '/what-happens-next'

// The Groundwork explainer a parent reads after the Meta instant form's "See how it works"
// button. She has given her number and seen the thank-you; this page explains, it does not ask.
describe('What happens next — the Groundwork explainer, on a phone', MOBILE, () => {
  // The pixel snippet in index.html keeps an fbq that is already there, so a stub set before
  // the page loads records every pixel call without anything reaching Meta.
  const visit = () => cy.visit(PAGE, { onBeforeLoad(win) { win.fbq = cy.stub().as('fbq') } })

  it('opens on the idea, not an ask, and never scrolls sideways', () => {
    visit()
    cy.get('[data-cy="hero-headline"]').should('be.visible').and('contain', 'built in skills')
    cy.get('[data-cy="nx-hero"] .btn, [data-cy="nx-hero"] form').should('not.exist')
    cy.document().then((doc) => expect(doc.documentElement.scrollWidth).to.be.at.most(390))
  })

  it('asks for nothing: no form, no booking button, no sticky bar, no header phone; one WhatsApp line, last', () => {
    visit()
    cy.get('main form').should('not.exist')
    cy.get('.site-header .nav-cta').should('not.exist')
    cy.get('[data-cy="mobile-bar"]').should('not.exist')
    cy.contains('a, button', /book a free lesson/i).should('not.exist')
    cy.get('main .btn-wa').should('have.length', 1)
    cy.get('[data-cy="nx-final"] [data-cy="nx-whatsapp"]').should('exist')
  })

  it('follows the brand rules: one swipe, in the headline, which is not a question; no price', () => {
    visit()
    cy.get('main .hl').should('have.length', 1)
    cy.get('h1 .hl').should('exist')
    cy.get('h1').invoke('text').should('not.contain', '?')
    cy.get('main').invoke('text').should('not.match', /\$\s?\d/)
  })

  it('explains the whole program, in order', () => {
    visit()
    const order = ['nx-hero', 'nx-years', 'nx-map', 'nx-diagnostic', 'nx-program', 'nx-between', 'nx-parent', 'nx-not', 'faq', 'nx-final']
    cy.get('main > section').then(($s) => expect([...$s].map((el) => el.dataset.cy)).to.deep.equal(order))
    cy.get('[data-cy="nx-diagnostic"] li').should('have.length', 6)
    cy.get('[data-cy="nx-parts"] li').should('have.length', 4).first().should('contain', 'Pre-test')
    cy.get('[data-cy="nx-parts"] li').last().should('contain', 'The final test')
    cy.get('[data-cy="faq"] details').should('have.length.greaterThan', 7)
  })

  it('names real skills from the chain, and links to the whole map', () => {
    visit()
    cy.get('[data-cy="nx-chain"] li').should('have.length', 3)
    cy.get('[data-cy="nx-chain"]').should('contain', 'All multiplication and division facts to 10 × 10').and('contain', 'Comparing fractions and equivalence').and('contain', 'Adding and subtracting fractions')
    cy.get('[data-cy="nx-map"]').invoke('text').should('match', /\b8\d skills across number, algebra/)
    cy.get('[data-cy="nx-skills"] article').should('have.length', 2).first().should('contain', 'Why it matters')
    cy.get('[data-cy="nx-map"] a[href="/maths-map"]').should('exist')
    cy.get('[data-cy="nx-clip"]').should('have.attr', 'poster', '/video/follow-the-line-poster.jpg').and('have.attr', 'muted')
  })

  it('tells the pixel she kept reading (ViewContent), and stays out of search', () => {
    visit()
    cy.get('@fbq').should('have.been.calledWith', 'track', 'ViewContent', Cypress.sinon.match({ content_name: 'what-happens-next' }))
    cy.get('head meta[name="robots"]').should('have.attr', 'content').and('contain', 'noindex')
    cy.title().should('contain', 'How Groundwork works')
  })

  it('a WhatsApp tap is Contact, never Lead: the lead was already counted by the form', () => {
    visit()
    cy.get('[data-cy="nx-whatsapp"]').should('have.attr', 'href').and('match', /^https:\/\/wa\.me\/61452330300\?text=/)
    cy.get('[data-cy="nx-phone"]').should('have.attr', 'href', 'tel:+61452330300')
    cy.get('[data-cy="nx-whatsapp"]').invoke('removeAttr', 'target').invoke('attr', 'href', '#').click()
    cy.get('@fbq').should('have.been.calledWith', 'track', 'Contact')
    cy.get('@fbq').should('not.have.been.calledWith', 'track', 'Lead')
  })
})
