import './commands';

Cypress.on('uncaught:exception', (err) => {
  console.error('Uncaught exception in E2E test:', err);
  return false;
});
