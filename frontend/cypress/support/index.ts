// Import commands.ts using ES2015 syntax:
import './commands';

// E2E specific configurations
Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from failing the test
  console.error('Uncaught exception in E2E test:', err);
  return false;
});
