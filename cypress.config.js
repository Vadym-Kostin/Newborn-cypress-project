const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  env: {
    email: "vadymtest@gmail.com",
    password: "testpassword"
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://5.189.186.217",
    supportFile: "cypress/support/e2e.{js,jsx,ts,tsx}",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}"
  },
});