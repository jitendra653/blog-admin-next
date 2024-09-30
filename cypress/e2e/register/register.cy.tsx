/// <reference types="cypress" />
describe('Register Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register')
  })

  it('should display an error message when fields are missing', () => {
    cy.get('button[type="submit"]').click()
    cy.get('div.bg-red-500').should('be.visible').and('contain', 'All fields are necessary.')
  })

  it('should display an error message if user already exists', () => {
    cy.intercept('POST', '/api/userExists', {
      statusCode: 200,
      body: { user: true },
    })

    cy.get('input[placeholder="Full Name"]').type('Jitendra Patidar')
    cy.get('input[placeholder="Email"]').type('admin@gmail.com')
    cy.get('input[placeholder="Password"]').type('admin@gmail.com')
    cy.get('button[type="submit"]').click()

    cy.get('div.bg-red-500').should('be.visible').and('contain', 'User already exists.')
  })

  it('should successfully register a new user and redirect', () => {
    cy.intercept('POST', '/api/userExists', {
      statusCode: 200,
      body: { user: false },
    })

    cy.intercept('POST', '/api/register', {
      statusCode: 200,
      body: {},
    })

    cy.get('input[placeholder="Full Name"]').type('Jitendra')
    cy.get('input[placeholder="Email"]').type('jitendra@gmail.com')
    cy.get('input[placeholder="Password"]').type('Admin@123')
    cy.get('button[type="submit"]').click()

    cy.wait(1000)

    cy.url().should('include', '/')
  })

  it('should reset the form fields when Reset button is clicked', () => {
    cy.get('input[placeholder="Full Name"]').type('Jitendra')
    cy.get('input[placeholder="Email"]').type('jitendra@gmail.com')
    cy.get('input[placeholder="Password"]').type('Admin@123')

    cy.get('button[type="button"]').contains('Reset').click()

    cy.get('input[placeholder="Full Name"]').should('have.value', '')
    cy.get('input[placeholder="Email"]').should('have.value', '')
    cy.get('input[placeholder="Password"]').should('have.value', '')
  })

  it('should navigate to login page when the login link is clicked', () => {
    cy.get('a').contains('Already have an account? Login').click()
    cy.url().should('include', '/')
  })
})
