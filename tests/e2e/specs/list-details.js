const LIST = {
  value: "lists",
  response: {
    data: {
      id: "1",
      type: "list",
      attributes: {
        label: "Sample List Label",
        name: "Sample List Name",
        shortDescription: "Sample List Short Description"
      },
      relationships: {
        listAccessibility: {
          data: {
            id: "1",
            type: "accessibilityType"
          }
        },
        types: {
          data: [
            {
              id: "1",
              type: "listType"
            }
          ]
        }
      }
    }
  }
};

const ACCESSIBILITY_TYPE = {
  value: "accessibilityTypes",
  response: {
    data: [
      {
        id: "1",
        type: "accessibilityType",
        attributes: {
          label: "Sample Accesibility Type Label",
          name: "Sample Accesibility Type Name"
        }
      }
    ]
  }
};

const LIST_TYPE = {
  value: "listTypes",
  response: {
    data: [
      {
        id: "1",
        type: "listType",
        attributes: {
          label: "Sample List Type Label",
          name: "Sample List Type Name"
        }
      }
    ]
  }
};

describe("The lists detail page", () => {
  beforeEach(() => {
    cy.adminLogin();
    cy.server();

    cy.route(LIST.value + "/" + LIST.response.data.id, LIST.response);
    cy.route(ACCESSIBILITY_TYPE.value, ACCESSIBILITY_TYPE.response);
    cy.route(LIST_TYPE.value, LIST_TYPE.response);
    console.log(ACCESSIBILITY_TYPE.response);
    console.log(LIST_TYPE.response);

    cy.visit("/lists/" + LIST.response.data.id);
  });
  it("should have title", () => {
    cy.contains("h1", "Sample List Name Details");
  });
  it("should load the list details form", () => {
    cy.get("#name").should("have.value", LIST.response.data.attributes.name);
    cy.get("#label").should("have.value", LIST.response.data.attributes.label);
    cy.get("#shortDescription").should(
      "have.value",
      LIST.response.data.attributes.shortDescription
    );
    cy.get("#listAccessibility").should(
      "have.value",
      LIST.response.data.relationships.listAccessibility.data.id
    );
    // WIP
    cy.get("#types")
      .invoke("val")
      .should("deep.equal", [
        LIST.response.data.relationships.types.data[0].id
      ]);
  });
});