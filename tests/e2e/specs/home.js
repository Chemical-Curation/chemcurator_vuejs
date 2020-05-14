describe("The home page", () => {
  before(() => {
    cy.adminLogin();
    cy.visit("/");
  });
  it("should have welcome msg", () => {
    cy.contains("h1", "Welcome to ChemReg");
  });
  it("should have dropdown", () => {
    cy.get("#compound-type-dropdown").contains("defined");
    cy.get("#compound-type-dropdown").contains("ill-defined");
  });
  it("should toggle ketcher/marvinjs on dropdown", () => {
    cy.get("#compound-type-dropdown").select("defined");
    cy.get("iframe[id=ketcher]");
    cy.get("#compound-type-dropdown").select("ill-defined");
    cy.get("iframe[id=marvin]");
  });
});
