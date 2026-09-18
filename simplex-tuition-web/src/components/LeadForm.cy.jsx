import { MemoryRouter } from 'react-router-dom'
import LeadForm from './LeadForm'
import { CONCERNS } from '../data/content'
import '../styles/site.css'

const mountForm = (props = {}) =>
  cy.mount(
    <MemoryRouter>
      <LeadForm location="hero" {...props} />
    </MemoryRouter>
  )

describe('<LeadForm />', () => {
  it('starts with one question and no typing', () => {
    mountForm()
    cy.get('[data-cy="step-concern"]').should('be.visible')
    cy.get('[data-cy^="form-concern-"]').should('have.length', CONCERNS.length)
    cy.get('[data-cy="form-submit"]').should('not.exist')
  })

  it('shows the matching echo for every answer', () => {
    CONCERNS.forEach((c) => {
      mountForm()
      cy.get(`[data-cy="form-concern-${c.id}"]`).click()
      cy.get('[data-cy="form-echo"]').should('have.text', c.echo)
    })
  })

  it('reaches the details step once a year is chosen', () => {
    mountForm()
    cy.get('[data-cy="form-concern-protect"]').click()
    cy.get('[data-cy="form-year-level"]').select('Year 7')
    cy.get('[data-cy="step-details"]').should('be.visible')
    cy.get('[data-cy="form-name"]').should('have.attr', 'required')
    cy.get('[data-cy="form-phone"]').should('have.attr', 'required')
    cy.get('[data-cy="form-submit"]').should('not.be.disabled')
  })

  it('keeps phone and WhatsApp reachable at every step', () => {
    mountForm()
    cy.get('[data-cy="form-whatsapp"]').should('have.attr', 'href').and('include', 'wa.me/61452330300')
    cy.get('[data-cy="form-concern-slipping"]').click()
    cy.get('[data-cy="form-whatsapp"]').should('be.visible')
  })
})
