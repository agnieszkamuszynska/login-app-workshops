// Custom commands for login app testing
export {};

Cypress.Commands.add('mockLoginApi', (type: 'success' | 'failure') => {
    if (type === 'success') {
      cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MiwidXNlcl9uYW1lIjoiSm9obiBEb2UiLCJleHAiOjE2MTYxODEyMDAsImlhdCI6MTYxNjE3NzYwMH0'
        }
      }).as('loginSuccess');
    } else {
      cy.intercept('POST', '**/login', {
        statusCode: 401,
        body: { detail: 'Invalid credentials' }
      }).as('loginFailure');
    }
  });
  
  declare global {
    namespace Cypress {
      interface Chainable {
        /**
         * Mock login API response
         * @param type - Type of response (success or failure)
         */
        mockLoginApi(type: 'success' | 'failure'): Chainable<Element>;
      }
    }
  }
  
  Cypress.Commands.add('mockLoginApi', (type: 'success' | 'failure') => {
    if (type === 'success') {
      cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MiwidXNlcl9uYW1lIjoiSm9obiBEb2UiLCJleHAiOjE2MTYxODEyMDAsImlhdCI6MTYxNjE3NzYwMH0'
        }
      }).as('loginSuccess');
    } else {
      cy.intercept('POST', '**/login', {
        statusCode: 401,
        body: { detail: 'Invalid credentials' }
      }).as('loginFailure');
    }
  });
  
  declare global {
    namespace Cypress {
      interface Chainable {
        /**
         * Mock login API response
         * @param type - Type of response (success or failure)
         */
        mockLoginApi(type: 'success' | 'failure'): Chainable<Element>;
      }
    }
  }