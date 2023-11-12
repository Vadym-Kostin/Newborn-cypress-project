import { defineConfig } from "cypress";
import { configurePlugin } from "cypress-mongodb";

export default defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    json: true,
  },
  viewportHeight: 1080,
  viewportWidth: 1920,
  env: {
    email: "vadymtest@gmail.com",
    password: "testpassword",
    mongodb: {
      uri: "mongodb://testUser:qwerty12345@5.189.186.217:27017/?authMechanism=DEFAULT",
      database: "admin"
    }
  },
  e2e: {
    setupNodeEvents(on) {
      configurePlugin(on);
    },
    baseUrl: "http://5.189.186.217",
    supportFile: "cypress/support/e2e.{js,jsx,ts,tsx}",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}"
  },
});