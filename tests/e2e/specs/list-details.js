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
    },
    included: [
        {
            type: "accessibilityType",
            id: "1",
            attributes: {
                name: "new-name",
                label: "acc type",
                shortDescription: "this is one of many",
                longDescription: "",
                deprecated: true
            }
        },
        {
            type: "listType",
            id: "1",
            attributes: {
                name: "list-type1",
                label: "list type1",
                shortDescription: "this is the first",
                longDescription: "this will always be the first",
                deprecated: true
            }
        }
    ],
  }
};

describe("The lists detail page", () => {
  beforeEach(() => {
    cy.adminLogin();
    cy.server();

    cy.route(LIST.value + "/" + LIST.response.data.id + "?include=listAccessibility,types", LIST.response);

    cy.visit("/lists/" + LIST.response.data.id);
  });
  it("should have title", () => {
    cy.contains("h1", "Sample List Name Details");
  });
  it("should load the list details form", () => {
    cy.get("#list-name-1").should("have.id", "list-name-" + LIST.response.data.id);
    cy.get("#list-name-1").contains(LIST.response.data.attributes.name);
    cy.get("#list-label-1").contains(LIST.response.data.attributes.label);
    cy.get("#list-short-1").contains(LIST.response.data.attributes.shortDescription);
    cy.get("#listAccessibility").contains(LIST.response.included[0].attributes.name);
    cy.get("#types button")
      .first()
      .invoke("text")
      .should("deep.equal",
        LIST.response.included[1].attributes.name
      );
  });
});
