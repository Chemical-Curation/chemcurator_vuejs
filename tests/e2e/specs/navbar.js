describe("The navbar", () => {
  before(() => {
    cy.adminLogin();
  });
  it("Home should have navbar", () => {
    cy.visit("/");
    cy.contains("nav", "ChemReg");
  });
  it("About should have navbar", () => {
    cy.visit("/about");
    cy.contains("nav", "ChemReg");
  });
});
