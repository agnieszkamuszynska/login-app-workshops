import { defineConfig } from 'cypress';

export default defineConfig({
  // E2E test configuration
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // E2E-specific node events
    },
  },
  
  // Integration/Component test configuration
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    setupNodeEvents(on, config) {
      // Component-specific node events
    }
  },
  
  // Shared settings
  viewportWidth: 1280,
  viewportHeight: 720,
  screenshotOnRunFailure: true,
  video: true,
});