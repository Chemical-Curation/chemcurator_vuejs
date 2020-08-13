describe("The navbar", () => {
  before(() => {
    cy.adminLogin();
  });
  it("home should have navbar", () => {
    cy.visit("/");
    cy.contains("nav", "chemreg");
  });
  it("substance should have navbar", () => {
    cy.visit("/substance");
    cy.contains("nav", "chemreg");
  });
});
