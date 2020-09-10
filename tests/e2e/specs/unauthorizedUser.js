describe("Unauthorized User Page", () => {
  beforeEach(() => {
    cy.server();
    cy.visit("/lists");
  });
  it("It should redirect to the Unauthorized User Page", () => {
    cy.contains("h1", "Unauthorized User");
    cy.contains("h5", "Please contact the site administrator to gain access");
  });
});
