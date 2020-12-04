// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("adminLogin", () => {
  cy.request({
    method: "POST",
    url: Cypress.env("VUE_APP_API_URL") + "/login/",
    auth: {
      user: Cypress.env("VUE_APP_TEST_ADMIN_USER"),
      pass: Cypress.env("VUE_APP_TEST_ADMIN_PASS"),
      sendImmediately: true
    }
  });
});

Cypress.Commands.add("nonAdminLogin", () => {
  cy.request({
    method: "POST",
    url: Cypress.env("VUE_APP_API_URL") + "/login/",
    auth: {
      user: Cypress.env("VUE_APP_TEST_USER"),
      pass: Cypress.env("VUE_APP_TEST_PASS"),
      sendImmediately: true
    }
  });
});

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
