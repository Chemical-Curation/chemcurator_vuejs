describe("The home page", () => {
  before(() => {
    cy.adminLogin();
    cy.visit("/");
  });
  it("Home should have welcome msg", () => {
    cy.contains("h1", "Welcome to ChemReg");
  });
  it("Home should have Ketcher", () => {
    cy.get("[data-cy=ketcher]").contains("ketcher");
  });
});
