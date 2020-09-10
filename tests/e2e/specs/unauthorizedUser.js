describe("Unauthorized User Page", () => {
  beforeEach(() => {
    cy.server();
    cy.visit("/lists");
  });
  it("It should redirect to the Unauthorized User Page", () => {
    cy.contains("h1", "Unauthorized User");
  });
});
