describe("login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  const getStore = () => cy.window().its("app.$store");

  it("state has user property empty", () => {
    getStore()
      .its("state")
      .should("have.keys", ["user"]);
    getStore()
      .its("state.user")
      .should("equal", "");
  });

  it("A User logs in and sees their username in the nav bar", () => {
    login("annabelle", "specialP@55word");
    getStore()
      .its("state.user")
      .should("equal", "annabelle");
    expect(cy.contains("annabelle")).toBeTruthy;
  });

  it("A User logs off and sees login page", () => {
    login("annabelle", "specialP@55word");
    logout();
    getStore()
      .its("state.user")
      .should("equal", "");
    expect(cy.contains("Please log in..."));
  });

  it("Username displays error", () => {
    cy.login("", "password");
    cy.contains("#username-live-feedback", "This is a required field.");
  });

  it("Password displays error", () => {
    cy.login("garbage", "");
    cy.contains(
      "#password-live-feedback",
      "This is a required field and must be at least 8 characters."
    );
  });

  it("A User logs in with bad credentials and gets error", () => {
    login("garbage", "password");
    getStore()
      .its("state.user")
      .should("equal", "");
    cy.contains("Invalid username/password.");
  });
});

const logout = () => {
  cy.get("[name='user-profile']").click();
  cy.get("[name='logout']").click();
};

const login = (username, password) => {
  if (username) {
    cy.get("#text-username").type(username);
  }
  if (password) {
    cy.get("#text-password").type(password);
  }
  cy.get("[name='submit']").click();
};
