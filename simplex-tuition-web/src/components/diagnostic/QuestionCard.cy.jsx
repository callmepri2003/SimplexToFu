import QuestionCard from './QuestionCard'

const question = {
  id: 'm-h-1',
  question: 'Solve for x: 3x + 7 = 22',
  options: ['x = 3', 'x = 5', 'x = 4', 'x = 6'],
  answer: 'x = 5',
}

describe('QuestionCard', () => {
  let onAnswer

  beforeEach(() => {
    onAnswer = cy.stub().as('onAnswer')
    cy.mount(<QuestionCard question={question} onAnswer={onAnswer} />)
  })

  it('renders the question text', () => {
    cy.get('[data-cy="question-text"]').should('contain.text', 'Solve for x')
  })

  it('renders all 4 answer options', () => {
    cy.get('[data-cy^="question-option-"]').should('have.length', 4)
    question.options.forEach((opt, i) => {
      cy.get(`[data-cy="question-option-${i}"]`).should('contain.text', opt)
    })
  })

  it('calls onAnswer with the selected option text', () => {
    cy.get('[data-cy="question-option-1"]').click()
    cy.get('@onAnswer').should('have.been.calledWith', 'x = 5')
  })

  it('disables all options after one is selected', () => {
    cy.get('[data-cy="question-option-0"]').click()
    cy.get('[data-cy^="question-option-"]').each(($btn) => {
      cy.wrap($btn).should('be.disabled')
    })
  })

  it('marks the selected option visually', () => {
    cy.get('[data-cy="question-option-2"]').click()
    cy.get('[data-cy="question-option-2"]').should('have.class', /optionSelected/)
  })

  it('does not call onAnswer a second time if clicked twice rapidly', () => {
    cy.get('[data-cy="question-option-0"]').click().click()
    cy.get('@onAnswer').should('have.been.calledOnce')
  })
})
