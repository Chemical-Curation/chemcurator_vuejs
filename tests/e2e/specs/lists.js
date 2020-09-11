const LISTS = {
  value: "/lists*",
  response: {
    data: [
      {
        attributes: {
          label: "sample List label",
          name: "sample List name",
          shortDescription: "sample List short description"
        }
      }
    ]
  }
};

describe("The lists page", () => {
  beforeEach(() => {
    cy.adminLogin();
    cy.server();
    cy.route(LISTS.value, LISTS.response);
    cy.visit("/lists");
  });
  it("should have title", () => {
    cy.contains("h1", "Lists");
  });
  it("should load all types", () => {
    cy.get("#list-table").contains(LISTS.response.data[0].attributes.label);
    cy.get("#list-table").contains(LISTS.response.data[0].attributes.name);
    cy.get("#list-table").contains(
      LISTS.response.data[0].attributes.shortDescription
    );
  });
});
