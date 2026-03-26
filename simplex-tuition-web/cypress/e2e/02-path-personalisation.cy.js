const paths = [
  { id: 'struggling', modal: { who: 'parent', school: 'high', concern: 'struggling' }, headline: "isn't behind" },
  { id: 'assessment', modal: { who: 'parent', school: 'high', concern: 'assessment' }, headline: "still time" },
  { id: 'selective', modal: { who: 'parent', school: 'high', concern: 'selective' }, headline: 'Selective school' },
  { id: 'ahead', modal: { who: 'parent', school: 'high', concern: 'ahead' }, headline: "Good isn't good enough" },
  { id: 'student', modal: { who: 'student' }, headline: 'Actually understand it' },
]

paths.forEach(({ id, modal, headline }) => {
  describe(`Path: ${id}`, () => {
    before(() => {
      cy.resetVisitorState()
      cy.visit('/')
      cy.completeModal(modal)
    })

    it(`hero headline matches path ${id}`, () => {
      cy.get('[data-cy="hero-headline"]').should('contain.text', headline)
    })
  })
})

describe('Path persistence across reload', () => {
  before(() => {
    cy.resetVisitorState()
    cy.seedPath('selective')
    cy.visit('/')
  })

  it('hero headline matches selective without modal', () => {
    cy.get('[data-cy="welcome-modal"]').should('not.exist')
    cy.get('[data-cy="hero-headline"]').should('contain.text', 'Selective school')
  })
})
