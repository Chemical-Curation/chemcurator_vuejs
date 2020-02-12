describe("Home should have navbar", () => {
  it("Visits the app root url", () => {
    cy.visit("localhost:8080");
    cy.contains("navbar", "ChemReg");
  });
});

describe("Home should have welcome msg", () => {
  it("Visits the app root url", () => {
    cy.visit("localhost:8080");
    cy.contains("h1", "Welcome to ChemReg");
  });
});
