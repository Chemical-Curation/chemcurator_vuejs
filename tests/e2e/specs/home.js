describe("The home page as seen by a visitor", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("should have lorem ipsum", () => {
    cy.contains("p", "Lorem ipsum dolor sit amet");
  });
  it("should display the login form to a non-authenticated user", () => {
    cy.get("#login-card");
  });
  it("should not display the search bar form to a non-authenticated user", () => {
    cy.get("[data-cy=search-box]").should("not.exist");
  });
  it("refuses bad logins", function() {
    cy.get("input[name=username]").type("foo");
    cy.get("input[name=password]").type("bar{enter}");
    cy.get(".alert").contains("Invalid username/password");
  });
  it("username/password required", function() {
    cy.get("input[name=username]")
      .invoke("attr", "required")
      .should("exist");
    cy.get("input[name=password]")
      .invoke("attr", "required")
      .should("exist");
  });
});

describe("The home page as seen by an authenticated user", () => {
  beforeEach(() => {
    const user = Cypress.env("VUE_APP_TEST_ADMIN_USER");
    const pass = Cypress.env("VUE_APP_TEST_ADMIN_PASS");

    cy.visit("/");
    cy.get("input[name=username]").type(user);
    cy.get("input[name=password]").type(`${pass}{enter}`);
  });
  it("should not display the login form to an authenticated user", () => {
    cy.get("#login-card").should("not.exist");
  });
  it("should display the search bar form to an authenticated user", () => {
    cy.get("[data-cy=search-box]");
  });
  it("sets and deletes sessionid cookie on login/logout", function() {
    // we should be redirected to /
    cy.url().should("eq", Cypress.config().baseUrl);
    // our auth cookie should be present
    cy.getCookie("sessionid").should("exist");
    // UI should reflect this user being logged in
    cy.get("[name='user-profile']").should("contain", "karyn");
    // cookie should be deleted on logout
    cy.get("[name='user-profile']").click();
    cy.get("[name='logout']").click();
    cy.getCookie("sessionid").should("not.exist");
  });
});
