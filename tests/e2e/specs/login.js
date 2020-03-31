describe("The login page", () => {
  it("sets and deletes sessionid cookie on login/logout", function() {
    const user = Cypress.env("VUE_APP_TEST_ADMIN_USER");
    const pass = Cypress.env("VUE_APP_TEST_ADMIN_PASS");

    cy.visit("/login");
    cy.get("input[name=username]").type(user);
    cy.get("input[name=password]").type(`${pass}{enter}`);
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
  it("refuses bad logins", function() {
    cy.visit("/login");
    cy.get("input[name=username]").type("foo");
    cy.get("input[name=password]").type("bar{enter}");
    cy.get(".alert").contains("Invalid username/password");
  });
  it("username/password required", function() {
    cy.visit("/login");
    cy.get("input[name=username]")
      .invoke("attr", "required")
      .should("exist");
    cy.get("input[name=password]")
      .invoke("attr", "required")
      .should("exist");
  });
  it("redirects to login page when anonymous", function() {
    cy.visit("/");
    cy.url().should("eq", Cypress.config().baseUrl + "login");
    cy.visit("/about");
    cy.url().should("eq", Cypress.config().baseUrl + "login");
  });
});
