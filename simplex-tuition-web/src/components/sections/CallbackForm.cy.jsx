import CallbackForm from './CallbackForm'
import { paths } from '../../data/pathContent'

describe('CallbackForm', () => {
  let onSubmitted

  beforeEach(() => {
    onSubmitted = cy.stub().as('onSubmitted')
    cy.intercept('POST', '**', { statusCode: 200, body: { ok: true } }).as('formPost')
    cy.mount(<CallbackForm pathId="struggling" onSubmitted={onSubmitted} />)
  })

  it('renders all required fields', () => {
    cy.get('[data-cy="form-name"]').should('exist')
    cy.get('[data-cy="form-phone"]').should('exist')
    cy.get('[data-cy="form-year-level"]').should('exist')
    cy.get('[data-cy^="form-time-btn"]').should('have.length', 3)
  })

  it('year level dropdown contains all K–12 options', () => {
    const levels = [
      'Kindergarten', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5',
      'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12',
    ]
    levels.forEach((level) => {
      cy.get('[data-cy="form-year-level"]').find(`option[value="${level}"]`).should('exist')
    })
  })

  it('submit button is disabled when no time is selected', () => {
    cy.get('[data-cy="form-name"]').type('Test Parent')
    cy.get('[data-cy="form-phone"]').type('0412 345 678')
    cy.get('[data-cy="form-year-level"]').select('Year 9')
    cy.get('[data-cy="form-submit"]').should('be.disabled')
  })

  it('submit button is enabled when all required fields are filled', () => {
    cy.get('[data-cy="form-name"]').type('Test Parent')
    cy.get('[data-cy="form-phone"]').type('0412 345 678')
    cy.get('[data-cy="form-year-level"]').select('Year 9')
    cy.get('[data-cy="form-time-btn-0"]').click()
    cy.get('[data-cy="form-submit"]').should('not.be.disabled')
  })

  it('selecting a time button marks it as active', () => {
    cy.get('[data-cy="form-time-btn-0"]').click()
    cy.get('[data-cy="form-time-btn-0"]').should('have.class', /timeBtnActive/)
  })

  it('selecting a different time button deactivates the previous one', () => {
    cy.get('[data-cy="form-time-btn-0"]').click()
    cy.get('[data-cy="form-time-btn-1"]').click()
    cy.get('[data-cy="form-time-btn-0"]').should('not.have.class', /timeBtnActive/)
    cy.get('[data-cy="form-time-btn-1"]').should('have.class', /timeBtnActive/)
  })

  it('calls onSubmitted after a successful submission', () => {
    cy.get('[data-cy="form-name"]').type('Test Parent')
    cy.get('[data-cy="form-phone"]').type('0412 345 678')
    cy.get('[data-cy="form-year-level"]').select('Year 9')
    cy.get('[data-cy="form-time-btn-0"]').click()
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@formPost')
    cy.get('@onSubmitted').should('have.been.calledOnce')
  })

  it('includes the pathId in the POST body', () => {
    cy.intercept('POST', '**', (req) => {
      expect(req.body).to.have.property('path', 'struggling')
      req.reply({ statusCode: 200, body: { ok: true } })
    }).as('pathCheck')
    cy.get('[data-cy="form-name"]').type('Test Parent')
    cy.get('[data-cy="form-phone"]').type('0412 345 678')
    cy.get('[data-cy="form-year-level"]').select('Year 9')
    cy.get('[data-cy="form-time-btn-0"]').click()
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@pathCheck')
  })

  it('shows an error message when the submission fails', () => {
    cy.intercept('POST', '**', { statusCode: 500 }).as('failPost')
    cy.get('[data-cy="form-name"]').type('Test Parent')
    cy.get('[data-cy="form-phone"]').type('0412 345 678')
    cy.get('[data-cy="form-year-level"]').select('Year 9')
    cy.get('[data-cy="form-time-btn-0"]').click()
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@failPost')
    cy.get('[data-cy="form-error"]').should('be.visible')
    cy.get('@onSubmitted').should('not.have.been.called')
  })

  it('re-enables the submit button after a failed submission', () => {
    cy.intercept('POST', '**', { statusCode: 500 }).as('failPost')
    cy.get('[data-cy="form-name"]').type('Test Parent')
    cy.get('[data-cy="form-phone"]').type('0412 345 678')
    cy.get('[data-cy="form-year-level"]').select('Year 9')
    cy.get('[data-cy="form-time-btn-0"]').click()
    cy.get('[data-cy="form-submit"]').click()
    cy.wait('@failPost')
    cy.get('[data-cy="form-submit"]').should('not.be.disabled')
  })

  const pathHeadings = {
    assessment: "Let's build a plan before it's too late",
    selective: "Let's talk about your child's selective school goals",
    ahead: "Let's talk about your child's potential",
    student: 'Want to give it a try?',
  }

  Object.entries(pathHeadings).forEach(([pathId, expected]) => {
    it(`renders correct heading for path: ${pathId}`, () => {
      cy.mount(<CallbackForm pathId={pathId} onSubmitted={() => {}} />)
      cy.contains(expected).should('be.visible')
    })
  })
})
