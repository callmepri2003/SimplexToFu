describe('Home — message order and proof', () => {
  beforeEach(() => cy.visit('/'))

  it('leads with the keep-them-on-track promise', () => {
    cy.get('[data-cy="hero-headline"]').should('contain.text', 'on track')
  })

  it('shows every section in the avatar order', () => {
    const order = ['the-report', 'two-doors', 'one-on-one', 'lesson-photos', 'reviews', 'tutors', 'next-steps', 'faq', 'final-cta']
    order.forEach((s) => cy.get(`[data-cy="${s}"]`).should('exist'))
    cy.get('main section[data-cy]').then(($s) => {
      const actual = [...$s].map((el) => el.dataset.cy)
      expect(actual).to.deep.equal(order)
    })
  })

  it('shows the report-card hook and specific results', () => {
    cy.get('[data-cy="the-report"]').should('contain.text', 'Do more work at home.')
    cy.get('[data-cy="reviews"]').should('contain.text', '37% → 76%').and('contain.text', '93%')
  })

  it('never shows an hourly price', () => {
    cy.get('body').invoke('text').should('not.match', /\$\d+/)
  })

  it('header CTA jumps to the booking form', () => {
    cy.get('.site-header').contains('Book a free lesson').click()
    cy.url().should('include', '#book')
  })
})

describe('Contact links', () => {
  beforeEach(() => cy.visit('/'))

  it('WhatsApp links point at the business number', () => {
    cy.get('a[href*="wa.me"]').should('have.length.at.least', 2).each(($a) => {
      expect($a.attr('href')).to.include('wa.me/61452330300')
    })
  })

  it('phone links use the business number', () => {
    cy.get('a[href^="tel:"]').each(($a) => expect($a.attr('href')).to.equal('tel:+61452330300'))
  })
})
