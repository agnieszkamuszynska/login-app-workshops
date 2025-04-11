import { LoginPage } from '../pages/LoginPage.cy';

// Define proper interfaces for fixture data
interface User {
  email: string;
  password: string;
}

interface Users {
  validUser: User;
  invalidUser: User;
  testUser: User;
}

interface LoginSuccessResponse {
  token: string;
}

interface LoginErrorResponse {
  detail: string;
}

const loginPage = new LoginPage();

describe('Login Page', () => {
  beforeEach(() => {
    // Load fixtures
    cy.fixture('users.json').as('usersFixture');
    cy.fixture('login-success.json').as('successFixture');
    cy.fixture('login-error.json').as('errorFixture');

    cy.visit('/');

    // Setup API mock
    cy.intercept('POST', 'http://localhost:8000/login', (req) => {
      // Get users fixture directly to avoid typing issues
      return cy.fixture('users.json').then((users: Users) => {
        if (req.body.email === users.validUser.email && req.body.password === users.validUser.password) {
          return cy.fixture('login-success.json').then(response => {
            req.reply({
              statusCode: 200,
              body: response
            });
          });
        } else {
          return cy.fixture('login-error.json').then(response => {
            req.reply({
              statusCode: 401,
              body: response
            });
          });
        }
      });
    }).as('loginRequest');
  });

  context('Form validation', () => {
    it('validates required fields', () => {
      // Try to submit empty form
      loginPage.submitButton.click();
      
      // Check validation messages
      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('validates email format', () => {
      // Enter invalid email
      loginPage.emailInput.type('invalid-email');
      loginPage.submitButton.click();
      
      // Check validation message
      cy.contains('Please enter a valid email').should('be.visible');
    });
  });

  context('Authentication flow', () => {
    it('redirects to dashboard after successful login', () => {
      cy.fixture('users.json').then((users: Users) => {
        // Enter valid credentials
        loginPage.emailInput.type(users.validUser.email);
        loginPage.passwordInput.type(users.validUser.password);
        loginPage.submitButton.click();

        // Wait for API request to complete
        cy.wait('@loginRequest');
        
        // Check redirect
        cy.url().should('include', '/dashboard');
      });
    });

    it('shows error message after failed login', () => {
      cy.fixture('users.json').then((users: Users) => {
        // Enter invalid credentials
        loginPage.emailInput.type(users.invalidUser.email);
        loginPage.passwordInput.type(users.invalidUser.password);
        loginPage.submitButton.click();
        
        // Wait for API request
        cy.wait('@loginRequest');
        
        // Check error message
        cy.contains('Invalid credentials').should('be.visible');
        
        // Email should remain, password should be cleared (if this matches your implementation)
        loginPage.emailInput.should('have.value', users.invalidUser.email);
      });
    });
  });

  context('API interaction', () => {
    it('sends correct request payload', () => {
      cy.fixture('users.json').then((users: Users) => {
        // Create specific intercept for this test
        cy.intercept('POST', 'http://localhost:8000/login', (req) => {
          cy.wrap(req.body).as('requestBody');
          cy.wrap(req.headers).as('requestHeaders');
  
          req.reply({
            statusCode: 200, 
            body: { token: 'test-token' }
          });
        }).as('validationRequest');
  
        // Enter credentials and submit
        loginPage.emailInput.type(users.testUser.email);
        loginPage.passwordInput.type(users.testUser.password);
        loginPage.submitButton.click();
  
        // Wait for request and validate
        cy.wait('@validationRequest');
        cy.get('@requestBody').should('deep.equal', {
          email: users.testUser.email,
          password: users.testUser.password
        });
      });
    });
  });
});