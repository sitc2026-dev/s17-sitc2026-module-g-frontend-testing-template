describe('06 · Activity — charging', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
  })

  it('starts charging from a reserved hold', () => {
    // TODO: implement — use chen.wei@swaploop.test (integrated)
  })

  it('reflects live charging status until ready', () => {
    // TODO: implement
  })

  it('collects the bike and shows a receipt', () => {
    // TODO: implement
  })
})
