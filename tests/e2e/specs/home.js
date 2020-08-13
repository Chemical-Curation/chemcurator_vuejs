describe("The home page as seen by a visitor", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("should have lorem ipsum", () => {
    cy.contains("p", "Lorem ipsum dolor sit amet");
  });
  it("should display the login form to a non-authenticated user", () => {
    cy.get('#login-card')
  });
  it("should not display the search bar form to a non-authenticated user", () => {
    cy.get('[data-cy=search-box]').should('not.exist');
  });
});

describe("The home page as seen by an authenticated user", () => {
  beforeEach(() => {
    cy.adminLogin();
  });
  it("should not display the login form to an authenticated user", () => {
    cy.get('#login-card').should('not.exist');
  });
  it("should display the search bar form to an authenticated user", () => {
    cy.get('[data-cy=search-box]');
  });
});
