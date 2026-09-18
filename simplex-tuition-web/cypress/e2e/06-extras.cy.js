describe('Extras menu', () => {
  beforeEach(() => cy.visit('/'))

  it('stays out of the way until opened', () => {
    cy.get('[data-cy="extras-menu"]').should('not.exist')
    cy.get('[data-cy="extras-btn"]').should('have.attr', 'aria-expanded', 'false')
  })

  it('opens the distance check and answers for a suburb', () => {
    cy.get('[data-cy="extras-btn"]').click()
    cy.get('[data-cy="extras-distance"]').click()
    cy.get('[data-cy="distance-dialog"]').should('be.visible')
    cy.get('[data-cy="distance-suburb"]').select('Oran Park')
    cy.get('[data-cy="distance-result"]').should('contain.text', 'minutes by car')
    cy.get('[data-cy="distance-result"]').should('contain.text', 'Straight-line distance')
  })

  it('puts our own suburb a few minutes away', () => {
    cy.get('[data-cy="extras-btn"]').click()
    cy.get('[data-cy="extras-distance"]').click()
    cy.get('[data-cy="distance-suburb"]').select('Austral')
    cy.get('[data-cy="distance-result"]').should('contain.text', '1.5 km').and('contain.text', '3 minutes')
  })

  it('asks far-away families to call instead of promising', () => {
    cy.get('[data-cy="extras-btn"]').click()
    cy.get('[data-cy="extras-distance"]').click()
    cy.get('[data-cy="distance-suburb"]').select('Gregory Hills')
    cy.get('[data-cy="distance-result"]').should('contain.text', 'ask us about coming to you')
  })

  it('closes again without touching the page', () => {
    cy.get('[data-cy="extras-btn"]').click()
    cy.get('[data-cy="extras-distance"]').click()
    cy.get('[data-cy="distance-dialog"]').should('be.visible')
    cy.contains('[data-cy="distance-dialog"] button', 'Close').click()
    cy.get('[data-cy="distance-dialog"]').should('not.be.visible')
    cy.get('[data-cy="hero-headline"]').should('be.visible')
  })

  it('menu links still reach the page sections', () => {
    cy.get('[data-cy="extras-btn"]').click()
    cy.get('[data-cy="extras-menu"]').contains('Questions').click()
    cy.url().should('include', '#faq')
    cy.get('[data-cy="extras-menu"]').should('not.exist')
  })
})
