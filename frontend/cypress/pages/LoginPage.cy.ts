export class LoginPage {
  get emailInput() { return cy.get('[data-testid="email-input"]'); }
  get passwordInput() { return cy.get('[data-testid="password-input"]'); }
  get submitButton() { return cy.get('[data-testid="submit-button"]'); }


  enterEmail(email: string) {
    this.emailInput.clear().type(email);
  }

  enterPassword(password: string) {
    this.passwordInput.clear().type(password);
  }

  submitForm() {
    this.submitButton.click();
  }
}