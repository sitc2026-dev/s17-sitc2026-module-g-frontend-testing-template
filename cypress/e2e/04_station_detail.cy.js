describe('04 · Station detail and reserve', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
  })

  it('opens station detail from a list card', () => {
    // TODO: implement
  })

  it('reserves a swap hold when eligible', () => {
    // TODO: implement
  })

  it('surfaces last-charge conflict without inventing availability', () => {
    // TODO: implement — POST /api/v1/__force-conflict arms one 409 for next swap reserve
  })

  it('blocks a second reserve while another station hold is active', () => {
    // TODO: implement
  })
})
