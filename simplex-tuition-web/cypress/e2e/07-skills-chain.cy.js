const MOBILE = { viewportWidth: 390, viewportHeight: 844 }
const PAGE = '/maths-skills-chain'
const EQUATIONS = 'Solve an equation such as 2x − 5 = 11'

// The chain is drawn after the page loads, from its own chunk.
const chain = () => cy.get('[data-cy="skills-chain"] .vc-card', { timeout: 15000 })
const card = (label) => cy.contains('.vc-card', label)

describe('Maths skills chain — a parent on a phone', MOBILE, () => {
  beforeEach(() => {
    cy.visit(PAGE)
    chain().should('have.length.greaterThan', 100)
  })

  it('never scrolls sideways, and has no sticky sales bar over the chain', () => {
    cy.document().then((doc) => expect(doc.documentElement.scrollWidth).to.be.at.most(390))
    cy.get('[data-cy="mobile-bar"]').should('not.exist')
  })

  it('tapping a skill says what it means and how many skills sit under it', () => {
    card('Solving equations').scrollIntoView().click()
    cy.get('.pv-dock').should('contain', EQUATIONS)
    cy.get('.pv-dock .pv-solid').invoke('text').should('match', /^See the \d+ skills under it$/)
    cy.get('.vc-card--below').should('have.length.greaterThan', 20)
  })

  it('narrows to that skill’s path, and the phone’s Back button restores the whole chain', () => {
    card('Solving equations').scrollIntoView().click()
    cy.get('.pv-dock .pv-solid').click()
    cy.get('.pv-pathintro').should('contain', 'skills sit under this one')
    chain().should('have.length.lessThan', 60)
    cy.location('hash').should('match', /^#path=/)
    cy.go('back')
    chain().should('have.length.greaterThan', 100)
    cy.location('pathname').should('eq', PAGE)
  })

  // The owner's rule: the chain informs, the page underneath it asks. Nothing inside the chain
  // sells, links away, or tells a parent where their child's gap is.
  it('the chain itself carries no call to action and shows no ids or syllabus codes', () => {
    card('Solving equations').scrollIntoView().click()
    cy.get('.pv-dock .pv-solid').click()
    cy.get('.pv a').should('not.exist')
    cy.get('.pv').invoke('text').should((text) => {
      expect(text).not.to.match(/diagnostic|book|enquir|free lesson|start here/i)
      expect(text).not.to.match(/M-(K2|34|56|78|910|STD|ADV|X1|X2)-\d\d|\bMA[E1-5]-|\bMST-1/)
    })
  })

  it('the form under the chain knows what the parent was looking at, and sends it with the lead', () => {
    cy.intercept('POST', '**/formspree.io/**', (req) => {
      expect(req.body.offer).to.eq('diagnostic')
      expect(req.body.stuck_on).to.eq('Solving equations')
      expect(req.body.earlier_skills).to.be.greaterThan(20)
      expect(req.body.yearLevel).to.eq('Year 8')
      expect(req.body.form_location).to.eq('skills-chain')
      expect(req.body._subject).to.contain('diagnostic').and.to.contain('Solving equations')
      req.reply({ statusCode: 200, body: { ok: true } })
    }).as('lead')

    cy.contains('.pv-year', '8').click()
    card('Solving equations').scrollIntoView().click()
    cy.get('.pv-dock').should('be.visible')

    cy.get('[data-cy="chain-book"]').scrollIntoView()
    cy.get('.pv-dock').should('not.be.visible') // fixed to the bottom of the phone, so it steps aside for the form
    cy.get('[data-cy="lead-form-skills-chain"]').within(() => {
      cy.get('.lead-title').should('have.text', 'Book a maths diagnostic')
      cy.get('[data-cy="form-context"]').should('contain', 'Solving equations')
      cy.get('[data-cy="form-year-level"]').should('have.value', 'Year 8')
      cy.get('[data-cy="form-name"]').type('Test Parent')
      cy.get('[data-cy="form-phone"]').type('0412 345 678')
      cy.get('[data-cy="form-submit"]').should('contain', 'Book a diagnostic').click()
    })
    cy.wait('@lead')
    cy.url().should('include', '/thank-you')
    cy.get('[data-cy="thank-you-page"]').should('contain', 'maths diagnostic').and('not.contain', 'free one-hour lesson')
  })

  it('a link to one skill’s path opens on that path', () => {
    cy.visit(`${PAGE}#path=M-56-10`)
    cy.get('.pv-pathintro', { timeout: 15000 }).should('contain', '3/4 of $20')
  })
})

describe('Maths skills chain — everywhere else is unchanged', () => {
  it('the ordinary lead form still asks for the free lesson', () => {
    cy.visit('/')
    cy.get('[data-cy="lead-form-hero"]').within(() => {
      cy.get('.lead-title').should('have.text', 'Book a free first lesson')
      cy.get('[data-cy="form-submit"]').should('contain', 'Book my free lesson')
      cy.get('[data-cy="form-context"]').should('not.exist')
    })
  })
})

const prerendered = Cypress.env('PRERENDERED') ? describe : describe.skip

prerendered('Maths skills chain — prerendered HTML', () => {
  it('gives crawlers every stage and skill in plain words, with its own head', () => {
    cy.request(PAGE).its('body').should((html) => {
      expect(html).to.contain('<title>The Maths Skills Chain, Kindergarten to Year 12 | Simplex Tuition</title>')
      expect(html).to.contain('<link rel="canonical" href="https://simplextuition.com.au/maths-skills-chain" />')
      expect(html).to.contain('<h2>Years 5 and 6</h2>')
      expect(html).to.contain('Work out 3/4 of $20 in their head.')
      expect(html).not.to.match(/can_do|\bMA4-|M-78-10/)
    })
  })
})
