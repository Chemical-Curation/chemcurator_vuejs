// Simple test data.  Could me moved into a fixture
// https://docs.cypress.io/api/commands/fixture.html
const TYPES = [
  {
    text: "QC Levels",
    value: "qcLevels",
    response: {
      "data": [
        {
          "attributes": {
            'label': "sample QC Label"
          }
        }
      ]
    }
  },
  {
    text: "Query Structure Types",
    value: "queryStructureTypes",
    response: {
      "data": [
        {
          "attributes": {
            'label': "sample Query Structure Type Label"
          }
        }
      ]
    }
  },
  {
    text: "Relationship Types",
    value: "relationshipTypes",
    response: {
      "data": [
        {
          "attributes": {
            'label': "sample Relationship Type Label"
          }
        }
      ]
    }
  },
  {
    text: "Sources",
    value: "sources",
    response: {
      "data": [
        {
          "attributes": {
            'label': "sample Source Label"
          }
        }
      ]
    }
  },
  {
    text: "Substance Types",
    value: "substanceTypes",
    response: {
      "data": [
        {
          "attributes": {
            'label': "sample Substance Type Label"
          }
        }
      ]
    }
  },
  {
    text: "Synonym Qualities",
    value: "synonymQualities",
    response: {
      "data": [
        {
          "attributes": {
            'label': "sample Synonym Quality Label"
          }
        }
      ]
    }
  },
  {
    text: "Synonym Types",
    value: "synonymTypes",
    response: {
      "data": [
        {
          "attributes": {
            'label': "sample Synonym Type Label"
          }
        }
      ]
    }
  }
]

describe("The vocabularies page", () => {
  beforeEach(() => {
    cy.adminLogin();
    cy.visit("/vocabularies");
  });
  it("should have title", () => {
    cy.contains("h1", "Controlled Vocabularies");
  });
  it("should load all types", () => {
    cy.wrap(TYPES).each((type) =>{
      cy.server()
      cy.route(type.value, type.response)
      cy.get('#radio-type-select')
        .contains(type.text)
        .get('input[value=' + type.value + ']').parent()
        .click()
        .then(
          () => {
            cy.get('#vocabulary-list-table')
              .contains(type.response.data[0].attributes.label)
          }
        )
    })
  });
});
