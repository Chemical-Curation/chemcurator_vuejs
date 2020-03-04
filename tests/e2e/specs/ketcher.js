describe("Home should Ketcher", () => {
  it("Visits the app root url", () => {
    cy.visit("./");
    cy.contains("div", "ketcher");
  });
});
