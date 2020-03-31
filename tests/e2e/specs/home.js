describe("The home page", () => {
  before(() => {
    cy.adminLogin();
    cy.visit("/");
  });
  it("should have welcome msg", () => {
    cy.contains("h1", "Welcome to ChemReg");
  });
  it("should have Ketcher", () => {
    cy.get("[data-cy=ketcher]").contains("ketcher");
  });
});
