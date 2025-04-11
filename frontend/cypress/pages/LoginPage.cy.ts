export class LoginPage {
    get emailInput() { return cy.get('[data-testid="email-input"]'); }
    get passwordInput() { return cy.get('[data-testid="password-input"]'); }
    get submitButton() { return cy.get('[data-testid="submit-button"]'); }
    get emailError() { return cy.get('[data-testid="email-error"]'); }
    get passwordError() { return cy.get('[data-testid="password-error"]'); }
    get errorMessage() { return cy.get('[data-testid="error-message"]'); }
    get successMessage() { return cy.get('[data-testid="success-message"]'); }
    

    visit() {
      cy.visit('/');
    }

    enterEmail(email: string) {
      this.emailInput.type(email);
    }

    enterPassword(password: string) {
      this.passwordInput.type(password);
    }

    submitForm() {
      this.submitButton.click();
    }

    login(email: string, password: string) {
      this.enterEmail(email);
      this.enterPassword(password);
      this.submitForm();
    }
  }