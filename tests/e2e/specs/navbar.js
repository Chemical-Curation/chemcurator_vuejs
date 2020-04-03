describe("The navbar", () => {
  before(() => {
    cy.adminLogin();
  });
  it("home should have navbar", () => {
    cy.visit("/");
    cy.contains("nav", "chemreg");
  });
  it("about should have navbar", () => {
    cy.visit("/about");
    cy.contains("nav", "chemreg");
  });
});
