describe('Login Form', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('should allow the user to login with valid credentials', () => {
      // Mock the `signIn` function for valid credentials
      cy.intercept('POST', '/api/auth/callback/credentials', {
        statusCode: 200,
        body: { ok: true },
      }).as('signIn');
  
      // Type valid email and password
      cy.get('input[placeholder="Email"]').type('validuser@example.com');
      cy.get('input[placeholder="Password"]').type('password123');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Wait for the login response and check the URL
      cy.wait('@signIn').then(() => {
        cy.url().should('include', '/admin');
      });
    });
  
    it('should show an error message for invalid credentials', () => {
      // Mock the `signIn` function for invalid credentials
      cy.intercept('POST', '/api/auth/callback/credentials', {
        statusCode: 401,
        body: { error: 'Invalid Credentials' },
      }).as('signIn');
  
      // Type invalid email and password
      cy.get('input[placeholder="Email"]').type('invaliduser@example.com');
      cy.get('input[placeholder="Password"]').type('wrongpassword');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Wait for the login response and check if error message is displayed
      cy.wait('@signIn').then(() => {
        cy.get('div.bg-red-500').should('contain', 'Invalid Credentials');
      });
    });
  
    it('should navigate to the register page when clicking the link', () => {
      // Click the 'Register' link
      cy.contains("Don't have an account?").click();
  
      // Verify the URL
      cy.url().should('include', '/register');
    });
  });
  