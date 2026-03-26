import Hero from './Hero'
import { paths } from '../../data/pathContent'
import '../../../src/styles/global.css'

const pathIds = Object.keys(paths)

describe('Hero', () => {
  pathIds.forEach((pathId) => {
    it(`renders correct headline for path: ${pathId}`, () => {
      cy.mount(<Hero pathId={pathId} />)
      cy.get('[data-cy="hero-headline"]').should('contain.text', paths[pathId].heroHeadline)
    })

    it(`renders correct CTA label for path: ${pathId}`, () => {
      cy.mount(<Hero pathId={pathId} />)
      cy.get('[data-cy="hero-cta"]').should('contain.text', paths[pathId].heroCTA)
    })
  })

  it('falls back to default content for an unknown pathId', () => {
    cy.mount(<Hero pathId="nonsense_path_xyz" />)
    cy.get('[data-cy="hero-headline"]').should('contain.text', paths.struggling.heroHeadline)
  })

  it('always shows location, subjects, and year range in trust bar', () => {
    cy.mount(<Hero pathId="struggling" />)
    cy.contains('Austral').should('be.visible')
    cy.contains('Maths & English').should('be.visible')
    cy.contains('K–12').should('be.visible')
  })

  it('always shows the 37% → 76% proof badge', () => {
    cy.mount(<Hero pathId="ahead" />)
    cy.contains('37%').should('be.visible')
    cy.contains('76%').should('be.visible')
  })
})
