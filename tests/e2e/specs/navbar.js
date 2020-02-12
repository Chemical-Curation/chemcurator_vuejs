// https://docs.cypress.io/api/introduction/api.html

describe("Home should have navbar", () => {
  it("Visits the app root url", () => {
    cy.visit("./");
    cy.contains("nav", "ChemReg");
  });
});

describe("Home should have welcome msg", () => {
  it("Visits the app root url", () => {
    cy.visit("./");
    cy.contains("h1", "Welcome to ChemReg");
  });
});
