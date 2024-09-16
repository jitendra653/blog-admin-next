import React from 'react';
import RegisterForm from '../../../components/register/RegisterForm'; // Adjust the import path as necessary
import "../../globals.css";
import { mount } from 'cypress/react18';

describe('RegisterForm Component', () => {
  beforeEach(() => {
    mount(<RegisterForm />);
  });

  it('should render the form elements correctly', () => {
    cy.get('input[placeholder="Full Name"]').should('be.visible');
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button[type="submit"]').contains('Register').should('be.visible');
    cy.get('a').contains("Already have an account? Login").should('be.visible');
  });

  it('should show an error when fields are missing', () => {
    cy.get('button[type="submit"]').click();
    cy.get('div.bg-red-500')
      .should('be.visible')
      .and('contain', 'All fields are necessary.');
  });

  it('should show an error if the user already exists', () => {
    cy.intercept('POST', '/api/userExists', {
      statusCode: 200,
      body: { user: true },
    });

    cy.intercept('POST', '/api/register', {
      statusCode: 400,
    });

    cy.get('input[placeholder="Full Name"]').type('Jitendra Patidar');
    cy.get('input[placeholder="Email"]').type('admin@gmail.com')
    cy.get('input[placeholder="Password"]').type('admin@gmail.com')
    cy.get('button[type="submit"]').click();

    cy.get('div.bg-red-500')
      .should('be.visible')
      .and('contain', 'User already exists.');
  });

  it('should successfully register a new user and clear the form', () => {
    cy.intercept('POST', '/api/userExists', {
      statusCode: 200,
      body: { user: false },
    });

    cy.intercept('POST', '/api/register', {
      statusCode: 200,
    });

    cy.get('input[placeholder="Full Name"]').type('Jitendra');
    cy.get('input[placeholder="Email"]').type('jitendra@gmail.com')
    cy.get('input[placeholder="Password"]').type('Admin@123');
    cy.get('button[type="submit"]').click();

    cy.get('input[placeholder="Full Name"]').should('have.value', '');
    cy.get('input[placeholder="Email"]').should('have.value', '');
    cy.get('input[placeholder="Password"]').should('have.value', '');
  });



it('should reset the form fields when Reset button is clicked', () => {
  cy.get('input[placeholder="Full Name"]').type('Jitendra')
  cy.get('input[placeholder="Email"]').type('jitendra@gmail.com')
  cy.get('input[placeholder="Password"]').type('Admin@123')

  cy.get('button[type="button"]').contains('Reset').click()

  cy.get('input[placeholder="Full Name"]').should('have.value', '')
  cy.get('input[placeholder="Email"]').should('have.value', '')
  cy.get('input[placeholder="Password"]').should('have.value', '')
})



});
