import { MemoryRouter } from 'react-router-dom'
import LeadForm from './LeadForm'
import '../styles/site.css'

const mountForm = (props = {}) =>
  cy.mount(
    <MemoryRouter>
      <LeadForm location="hero" {...props} />
    </MemoryRouter>
  )

describe('<LeadForm />', () => {
  it('renders the three required fields and optional concerns', () => {
    mountForm()
    cy.get('[data-cy="form-name"]').should('have.attr', 'required')
    cy.get('[data-cy="form-phone"]').should('have.attr', 'required')
    cy.get('[data-cy="form-year-level"]').should('have.attr', 'required')
    cy.get('[data-cy^="form-concern-"]').should('have.length', 5)
  })

  it('submit button is enabled before anything is filled in', () => {
    mountForm()
    cy.get('[data-cy="form-submit"]').should('not.be.disabled')
  })

  it('toggles a concern chip on and off', () => {
    mountForm()
    cy.get('[data-cy="form-concern-protect"]').click().should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-cy="form-concern-protect"]').click().should('have.attr', 'aria-pressed', 'false')
  })

  it('offers a WhatsApp fallback', () => {
    mountForm()
    cy.get('[data-cy="form-whatsapp"]').should('have.attr', 'href').and('include', 'wa.me/61452330300')
  })
})
