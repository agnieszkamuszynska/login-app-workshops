import { LoginPage } from "../pages/LoginPage.cy";
import { DashboardPage } from "../pages/DashbordPage.cy";

const loginPage = new LoginPage();
const dashboardPage = new DashboardPage();

describe('Login Application E2E Flow', () => {
  before(() => {
    cy.task('setupTestUsers', {
      validUser: {
        email: 'test.user@example.com',
        password: 'securePassword123',
        name: 'Test User',
        id: 42
      }
    }).then(response => {
      cy.log(`Test users set up with response: ${JSON.stringify(response)}`);
    });
  });

  after(() => {
    cy.task('cleanupTestUsers').then(response => {
      cy.log(`Test users cleaned up with response: ${JSON.stringify(response)}`);
    });
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.intercept('POST', '**/login').as('loginRequest');

    cy.visit('/');
  });

  it('should complete successful login flow and logout', () => {
    loginPage.enterEmail('test.user@example.com');
    loginPage.enterPassword('securePassword123');

    loginPage.submitForm();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    cy.url().should('include', '/dashboard');

    dashboardPage.welcomeHeader.should('contain.text', 'Test User');
    dashboardPage.userId.should('contain.text', '42');
    dashboardPage.username.should('contain.text', 'Test User');
    dashboardPage.loggedInMessage.should('be.visible');

    cy.reload();
    cy.url().should('include', '/dashboard');
    dashboardPage.welcomeHeader.should('be.visible');

    dashboardPage.logoutButton.click();
    cy.url().should('not.include', '/dashboard');
    loginPage.emailInput.should('be.visible');
  });
});