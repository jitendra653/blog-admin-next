/// <reference types="cypress" />
describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('should display an error message for missing fields', () => {
    cy.get('button[type="submit"]').click()

    cy.get('div.bg-red-500').should('be.visible').and('contain', 'All fields are necessary.')
  })

  it('should display an error message for invalid credentials', () => {
    // Mock the /api/userActive API to simulate valid user but invalid credentials
    cy.intercept('POST', '/api/userActive', {
      statusCode: 200,
      body: {
        userExits: true,
        active: true,
      },
    })

    cy.intercept('POST', '/api/auth/signin', {
      statusCode: 401,
      body: {
        error: 'Invalid Credentials',
      },
    })

    cy.get('input[type="text"]').type('admin12345@gmail.com')
    cy.get('input[type="password"]').type('admin')
    cy.get('button[type="submit"]').click()

    cy.get('div.bg-red-500').should('be.visible').and('contain', 'Invalid Credentials')
  })

  it('should display an error message for inactive accounts', () => {
    // Mock the /api/userActive API to simulate inactive account
    cy.intercept('POST', '/api/userActive', {
      statusCode: 200,
      body: {
        userExits: true,
        active: false,
      },
    })

    cy.get('input[type="text"]').type('admin1@gmail.com')
    cy.get('input[type="password"]').type('admin@gmail.com')
    cy.get('button[type="submit"]').click()

    cy.get('div.bg-red-500').should('be.visible').and('contain', 'This Account is inActive')
  })

  it('should redirect to /admin on successful login', () => {
    // Mock the /api/userActive API and /auth/signin
    cy.intercept('POST', '/api/userActive', {
      statusCode: 200,
      body: {
        userExits: true,
        active: true,
      },
    })

    cy.intercept('POST', '/api/auth/signin', {
      statusCode: 200,
      body: {
        ok: true,
        url: '/admin',
      },
    })

    cy.get('input[type="text"]').type('admin@gmail.com')
    cy.get('input[type="password"]').type('admin@gmail.com')
    cy.get('button[type="submit"]').click()

    // Ensure the loader hides after the login
    cy.wait(5000) // Adjust this wait time if necessary
    cy.url().should('include', '/admin')
  })

  it('should navigate to register page when the register link is clicked', () => {
    cy.get('a').contains("Don't have an account?").click()
    cy.url().should('include', '/register')
  })
})
