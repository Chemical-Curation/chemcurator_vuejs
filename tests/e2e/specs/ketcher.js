describe("Home should Ketcher", () => {
  it("Visits the app root url", () => {
    cy.visit("./");
    cy.get("[data-cy=ketcher]").contains("ketcher");
  });
});
