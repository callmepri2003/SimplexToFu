import { useVisitorPath } from './useVisitorPath'

function HookHarness() {
  const { path, modalSeen, savePath, resetPath } = useVisitorPath()
  return (
    <div>
      <span data-cy="path">{path ?? 'null'}</span>
      <span data-cy="modal-seen">{String(modalSeen)}</span>
      <button data-cy="save-struggling" onClick={() => savePath('struggling')}>save</button>
      <button data-cy="reset" onClick={resetPath}>reset</button>
    </div>
  )
}

describe('useVisitorPath hook', () => {
  beforeEach(() => { cy.clearLocalStorage() })

  it('returns null path and modalSeen=false when localStorage is empty', () => {
    cy.mount(<HookHarness />)
    cy.get('[data-cy="path"]').should('contain.text', 'null')
    cy.get('[data-cy="modal-seen"]').should('contain.text', 'false')
  })

  it('savePath writes the path and sets modalSeen=true', () => {
    cy.mount(<HookHarness />)
    cy.get('[data-cy="save-struggling"]').click()
    cy.get('[data-cy="path"]').should('contain.text', 'struggling')
    cy.get('[data-cy="modal-seen"]').should('contain.text', 'true')
  })

  it('savePath writes an expiry 30 days in the future', () => {
    cy.mount(<HookHarness />)
    cy.get('[data-cy="save-struggling"]').click()
    cy.window().then((win) => {
      const expiry = Number(win.localStorage.getItem('simplex_visitor_path_expiry'))
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
      expect(expiry).to.be.greaterThan(Date.now() + thirtyDaysMs - 5000)
      expect(expiry).to.be.lessThan(Date.now() + thirtyDaysMs + 5000)
    })
  })

  it('resetPath clears path and modalSeen', () => {
    cy.mount(<HookHarness />)
    cy.get('[data-cy="save-struggling"]').click()
    cy.get('[data-cy="reset"]').click()
    cy.get('[data-cy="path"]').should('contain.text', 'null')
    cy.get('[data-cy="modal-seen"]').should('contain.text', 'false')
  })

  it('reads a valid stored path on mount, skipping modal', () => {
    const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000
    cy.window().then((win) => {
      win.localStorage.setItem('simplex_visitor_path', 'selective')
      win.localStorage.setItem('simplex_visitor_path_expiry', String(expiry))
    })
    cy.mount(<HookHarness />)
    cy.get('[data-cy="path"]').should('contain.text', 'selective')
    cy.get('[data-cy="modal-seen"]').should('contain.text', 'true')
  })

  it('ignores an expired stored path', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('simplex_visitor_path', 'struggling')
      win.localStorage.setItem('simplex_visitor_path_expiry', String(Date.now() - 1000))
    })
    cy.mount(<HookHarness />)
    cy.get('[data-cy="path"]').should('contain.text', 'null')
  })
})
