const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://web:3000',
    supportFile: false,
    video: false,
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
})
