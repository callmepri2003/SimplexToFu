const paths = [
  { id: 'struggling', headline: "isn't behind" },
  { id: 'assessment', headline: 'still time' },
  { id: 'selective', headline: 'Selective school' },
  { id: 'ahead', headline: "Good isn't good enough" },
  { id: 'student', headline: 'Actually understand it' },
]

paths.forEach(({ id, headline }) => {
  describe(`Path: ${id}`, () => {
    before(() => {
      cy.resetVisitorState()
      cy.seedPath(id)
      cy.visit('/')
    })

    it(`hero headline matches path ${id}`, () => {
      cy.get('[data-cy="hero-headline"]').should('contain.text', headline)
    })
  })
})

describe('Path persistence from stored path', () => {
  before(() => {
    cy.resetVisitorState()
    cy.seedPath('selective')
    cy.visit('/')
  })

  it('hero headline matches the stored selective path', () => {
    cy.get('[data-cy="hero-headline"]').should('contain.text', 'Selective school')
  })
})
