describe('01 · Login', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
    cy.visit('/login.html')
  })

  it('loads the login page', () => {
    // TODO: implement
  })

  it('shows an error when email is missing', () => {
    // TODO: implement
  })

  it('shows an error for invalid credentials', () => {
    // TODO: implement
  })

  it('blocks suspended accounts', () => {
    // TODO: implement
  })

  it('signs in and reaches stations', () => {
    // TODO: implement
  })
})
