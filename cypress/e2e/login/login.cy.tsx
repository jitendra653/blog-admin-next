describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should display an error message for invalid credentials', () => {
    cy.get('input[type="text"]').type('asdf@gmail.com');
    cy.get('input[type="password"]').type('1235');
    cy.get('button[type="submit"]').click();
    
    cy.get('div.bg-red-500')
      .should('be.visible')
      .and('contain', 'Invalid Credentials');
  });

  it('should redirect to /admin on successful login', () => {
    cy.intercept('POST', '/api/auth/signin', {
      statusCode: 200,
      body: {
        ok: true,
        url: '/admin',
      },
    });

    cy.get('input[type="text"]').type('admin@gmail.com');
    cy.get('input[type="password"]').type('admin@gmail.com');
    cy.get('button[type="submit"]').click();
    cy.wait(5000);
    cy.url().should('include', '/admin');
  });

  it('should navigate to register page when the register link is clicked', () => {
    cy.get('a').contains("Don't have an account? Register").click();
    cy.url().should('include', '/register');
  });
});
