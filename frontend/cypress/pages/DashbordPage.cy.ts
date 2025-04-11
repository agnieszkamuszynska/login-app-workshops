export class DashboardPage {
    get welcomeHeader() { return cy.get('h1'); }
    get loggedInMessage() { return cy.contains('You are logged in'); }
    get logoutButton() { return cy.contains('Logout'); }
    get userId() { return cy.contains('User ID:').find('strong'); }
    get username() { return cy.contains('Username:').find('strong'); }
    

    waitForLoad() {
      cy.url().should('include', '/dashboard');
      this.welcomeHeader.should('be.visible');
    }
    
    logout() {
      this.logoutButton.click();
    }
  }