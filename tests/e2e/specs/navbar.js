// https://docs.cypress.io/api/introduction/api.html

describe("Visits the app root url", () => {
  before(() => {
    cy.login();
    cy.visit("/");
  });
  it("Home should have navbar", () => {
    cy.contains("nav", "ChemReg");
  });
  it("Home should have welcome msg", () => {
    cy.contains("h1", "Welcome to ChemReg");
  });
});
