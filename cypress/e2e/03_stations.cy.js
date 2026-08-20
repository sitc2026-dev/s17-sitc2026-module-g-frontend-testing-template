function signInAsLin() {
  cy.visit('/login.html')
  cy.get('[data-testid="login-email"]').type('lin.xiaoyu@swaploop.test')
  cy.get('[data-testid="login-password"]').type('password123')
  cy.get('[data-testid="login-submit"]').click()
  cy.get('[data-testid="stations-page"]').should('be.visible')
}

describe('03 · Stations list', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
  })

  it('lists stations for a signed-in rider', () => {
    // TODO: implement — hint: prefer data-testid selectors
    // signInAsLin is available above if useful
  })

  it('filters by station type', () => {
    // TODO: implement
  })

  it('shows compatible availability indication', () => {
    // TODO: implement
  })

  it('unauthenticated visitors can browse stations', () => {
    // TODO: implement
  })
})
