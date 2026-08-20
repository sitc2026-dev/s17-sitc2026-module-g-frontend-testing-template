describe('07 · Station QR scan', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
    cy.visit('/scan.html')
  })

  it('embeds the QR emulator', () => {
    // TODO: implement
  })

  it('navigates to station hub on a valid poster payload', () => {
    // TODO: implement
  })

  it('rejects a mismatched payload', () => {
    // TODO: implement
  })
})
