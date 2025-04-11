import { LoginPage } from '../pages/LoginPage.cy';

interface User {
  email: string;
  password: string;
}

interface Users {
  validUser: User;
  invalidUser: User;
  testUser: User;
}

const loginPage = new LoginPage();

describe('Login Page', () => {
  beforeEach(() => {
    cy.fixture('users.json').as('usersFixture');
    cy.fixture('login-success.json').as('successFixture');
    cy.fixture('login-error.json').as('errorFixture');

    cy.visit('/');

    cy.intercept('POST', 'http://localhost:8000/login', (req) => {
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

  // bad practice
  context('Form validation', () => {
    it('validates required fields', () => {
      loginPage.submitButton.click();

      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('validates email format', () => {
      loginPage.emailInput.type('invalid-email');

      loginPage.submitButton.click();
      cy.contains('Please enter a valid email').should('be.visible');
    });
  });

  context('Authentication flow', () => {
    it('redirects to dashboard after successful login', () => {
      cy.fixture('users.json').then((users: Users) => {

        loginPage.emailInput.type(users.validUser.email);
        loginPage.passwordInput.type(users.validUser.password);
        loginPage.submitButton.click();

        cy.wait('@loginRequest');

        cy.url().should('include', '/dashboard');
      });
    });

    it('shows error message after failed login', () => {
      cy.fixture('users.json').then((users: Users) => {

        loginPage.emailInput.type(users.invalidUser.email);
        loginPage.passwordInput.type(users.invalidUser.password);
        loginPage.submitButton.click();

        cy.wait('@loginRequest');

        cy.contains('Invalid credentials').should('be.visible');

        loginPage.emailInput.should('have.value', users.invalidUser.email);
      });
    });
  });

  context('API interaction', () => {
    it('sends correct request payload', () => {
      cy.fixture('users.json').then((users: Users) => {
        cy.intercept('POST', 'http://localhost:8000/login', (req) => {
          cy.wrap(req.body).as('requestBody');
          cy.wrap(req.headers).as('requestHeaders');

          req.reply({
            statusCode: 200,
            body: { token: 'test-token' }
          });
        }).as('validationRequest');

        loginPage.emailInput.type(users.testUser.email);
        loginPage.passwordInput.type(users.testUser.password);
        loginPage.submitButton.click();

        cy.wait('@validationRequest');
        cy.get('@requestBody').should('deep.equal', {
          email: users.testUser.email,
          password: users.testUser.password
        });
      });
    });
  });
});