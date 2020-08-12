describe("The about page to a non-authenticated user", () => {
  beforeEach(() => {
    //cy.adminLogin();
    cy.visit("/");
  });
  it("should redirect to the About page", () => {
    cy.location("pathname").should("eq", "/about");
  });
  it("should have lorem ipsum", () => {
    cy.contains("p", "Lorem ipsum dolor sit amet");
  });
});
