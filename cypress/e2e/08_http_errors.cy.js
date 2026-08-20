describe('08 · HTTP intercepts and errors', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
  })

  it('handles protected-route unauth by returning to login', () => {
    // TODO: implement
  })

  it('shows an actionable message on server error during reserve', () => {
    // TODO: implement — use cy.intercept to force a 500 on POST /api/v1/services
  })

  it('prevents double-submit while reserve is pending', () => {
    // TODO: implement — delay the reserve response and assert no duplicate success
  })
})
