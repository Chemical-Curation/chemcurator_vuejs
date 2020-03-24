describe("Home should Ketcher", () => {
  before(() => {
    cy.login();
  });
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.get("[data-cy=ketcher]").contains("ketcher");
    // cy.visit("./about");
  });
});
