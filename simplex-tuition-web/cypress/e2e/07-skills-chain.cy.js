const MOBILE = { viewportWidth: 390, viewportHeight: 844 }
const PAGE = '/maths-map/open'
// The map is given in exchange for an email (see 08-skills-map-landing). These tests are about the map
// itself, so they arrive the way a family does when a tutor texts them a link.
const OPEN = `${PAGE}?pass=family`
const EQUATIONS = 'Solve an equation such as 2x − 5 = 11'

// The chain is drawn after the page loads, from its own chunk.
const chain = () => cy.get('[data-cy="skills-chain"] .vc-card', { timeout: 15000 })
const card = (label) => cy.contains('.vc-card', label)

describe('Maths skills chain — a parent on a phone', MOBILE, () => {
  beforeEach(() => {
    cy.visit(OPEN)
    chain().should('have.length.greaterThan', 100)
  })

  it('never scrolls sideways, and has no sticky sales bar over the chain', () => {
    cy.document().then((doc) => expect(doc.documentElement.scrollWidth).to.be.at.most(390))
    cy.get('[data-cy="mobile-bar"]').should('not.exist')
  })

  it('tapping a skill says what it means and how many skills sit under it', () => {
    card('Solving equations').scrollIntoView().click()
    cy.get('.pv-dock').should('contain', EQUATIONS)
    cy.get('.pv-dock .pv-solid').invoke('text').should('match', /^See the \d+ skills it depends on$/)
    cy.get('.vc-card--below').should('have.length.greaterThan', 20)
  })

  // The point of narrowing is to SEE the unrelated skills disappear. If the page jumped to the top
  // instead, a parent would not notice anything had changed. So the tapped skill must stay put.
  const topOfChosen = () => cy.get('.vc-card--focus').then(($el) => Math.round($el[0].getBoundingClientRect().top))
  // The site scrolls smoothly, and tapping a skill nudges it clear of the dock. Measure once that has finished.
  const settled = () => {
    let last = -1
    cy.window().should((win) => { const y = Math.round(win.scrollY); const still = y === last; last = y; expect(still, 'page has stopped scrolling').to.eq(true) })
  }

  it('narrows to that skill’s path without moving the skill on screen, and Back restores the whole chain the same way', () => {
    card('Solving equations').scrollIntoView().click()
    cy.get('.pv-dock .pv-solid').should('be.visible')
    settled()
    topOfChosen().then((before) => {
      cy.get('.pv-dock .pv-solid').click()
      cy.get('.pv-dock--path').should('contain', 'earlier skills').and('contain', 'Back to the full chain')
      chain().should('have.length.lessThan', 60)
      cy.location('hash').should('match', /^#path=/)
      topOfChosen().should((after) => expect(Math.abs(after - before)).to.be.at.most(3))
    })
    settled()
    topOfChosen().then((before) => {
      cy.go('back')
      chain().should('have.length.greaterThan', 100)
      cy.location('pathname').should('eq', PAGE)
      topOfChosen().should((after) => expect(Math.abs(after - before)).to.be.at.most(3))
    })
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
    cy.visit(`${OPEN}#path=M-56-10`)
    cy.get('.pv-dock--path', { timeout: 15000 }).should('contain', 'earlier skills')
    cy.contains('.vc-card--focus', 'Fraction of a quantity').should('be.visible')
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

prerendered('Maths skills map — prerendered HTML', () => {
  // The map is what the email is exchanged for, so the file a crawler receives holds none of it.
  it('keeps the map out of the index and out of the page source', () => {
    cy.request(PAGE).its('body').should((html) => {
      expect(html).to.contain('<title>The Maths Skills Map | Simplex Tuition</title>')
      expect(html).to.contain('content="noindex, follow"')
      expect(html).not.to.contain('Work out 3/4 of')
      expect(html).not.to.match(/can_do|\bMA4-|M-78-10/)
    })
  })
})
