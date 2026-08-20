describe('02 · Register', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
    cy.visit('/register.html')
  })

  it('requires vehicle profile fields for swappable mode', () => {
    // TODO: implement
  })

  it('completes two-step register for a swappable rider', () => {
    // TODO: implement
  })

  it('completes two-step register for an integrated rider', () => {
    // TODO: implement
  })
})
