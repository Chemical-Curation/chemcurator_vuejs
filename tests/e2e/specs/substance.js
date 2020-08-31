let qstResponse = {
  data: [
    {
      id: 1,
      type: "queryStructureType",
      attributes: {
        label: "Markush",
      }
    },
    {
      id: 2,
      type: "queryStructureType",
      attributes: {
        label: "Ill Defined",
      }
    }
  ]
}

describe("The substance page", () => {
  beforeEach(() => {
    cy.adminLogin();
    cy.server()
    cy.route("queryStructureTypes", qstResponse)
    cy.visit("/substance");
  });
  it("should have dropdown", () => {
    cy.get("#compound-type-dropdown").contains("None");
    cy.get("#compound-type-dropdown").contains("Defined Compound");
    cy.get("#compound-type-dropdown").contains("Ill Defined");
    cy.get("#compound-type-dropdown").contains("Markush");
  });
  it("should toggle ketcher/marvinjs on dropdown", () => {
    cy.get("#compound-type-dropdown").select("Defined Compound");
    cy.get("iframe[id=ketcher]");
    cy.get("#compound-type-dropdown").select("Ill Defined");
    cy.get("iframe[id=marvin]");
  });
  it("should load defined compound into ketcher window", () => {
    // Verify no elements are in the iframe
    cy.get("iframe[id=ketcher]")
      .its("0.contentDocument.body")
      .should("not.be.empty")
      .then(cy.wrap)
      .find("#canvas")
      .children()
      .find("text")
      .should("not.exist");

    // Search
    cy.get("[data-cy=search-box]").type("DTXCID302000003");
    cy.get("[data-cy=search-button]").click();

    // Verify elements in iframe
    cy.get("iframe[id=ketcher]")
      .its("0.contentDocument.body")
      .should("not.be.empty")
      .then(cy.wrap)
      .find("#canvas")
      .children()
      .find("text")
      .should("exist");
  });
  it("should load illdefined compound into marvin window", () => {
    // Marvin uses a custom "canvas" node with no children to render molecules
    //  and uses tables instead of ids to render buttons.  I've opted to find nodes
    //  by their classes.  Clicks are also obscured so I've had to force them.

    // Verify no elements are in the iframe
    cy.get("iframe[id=marvin]")
      .its("0.contentDocument.body")
      .should("not.be.empty")
      .then(cy.wrap)
      .find("div[title='Export (Ctrl+S)']")
      .click({ force: true })
      .then(() => {
        cy.get("iframe[id=marvin]")
          .its("0.contentDocument.body")
          .should("not.be.empty")
          .then(cy.wrap)
          .find("textarea")
          .invoke("val")
          .should("equal", "<cml><MDocument></MDocument></cml>");

        // Close the window.  If the export window isn't closed, then the next compound won't load.
        cy.get("iframe[id=marvin]")
          .its("0.contentDocument.body")
          .should("not.be.empty")
          .then(cy.wrap)
          .find("div.gwt-HTML.mjs-CloseButton")
          .click({ force: true });
      });

    // Search
    cy.get("[data-cy=search-box]").type("DTXCID502000009");
    cy.get("[data-cy=search-button]").click();

    // Verify elements in iframe
    cy.get("iframe[id=marvin]")
      .its("0.contentDocument.body")
      .should("not.be.empty")
      .then(cy.wrap)
      .find("div[title='Export (Ctrl+S)']")
      .click({ force: true })
      .then(() => {
        cy.get("iframe[id=marvin]")
          .its("0.contentDocument.body")
          .should("not.be.empty")
          .then(cy.wrap)
          .find("textarea")
          .invoke("val")
          .should("not.equal", "<cml><MDocument></MDocument></cml>");
      });
  });
  // This test verifies functionality that no longer exists works.
  //   It should be updated and readded when something uses these messages.
  it.skip("should update the {import textarea} when ketcher changes", () => {
    cy.get("iframe[id=ketcher]")
      .its("0.contentDocument.body")
      .should("not.be.empty");
    cy.get("#ketcher-import-textarea")
      .invoke("val")
      .should("be.empty");
    cy.get("iframe[id=ketcher]")
      .its("0.contentDocument.body")
      .should("not.be.empty")
      .then(cy.wrap)
      .find("#atom")
      .find("button", "Hydrogen (H)")
      .first()
      .click();
    cy.get("iframe[id=ketcher]")
      .its("0.contentDocument.body")
      .should("not.be.empty")
      .then(cy.wrap)
      .find("#canvas")
      .click();
    cy.get("#ketcher-import-textarea")
      .invoke("val")
      .should("not.be.empty");
  });
  it("should load the substance form", () => {
    // Search
    cy.get("[data-cy=search-box]").type("DTXCID302000003");
    cy.get("[data-cy=search-button]").click();

    cy.get("#recordCompoundID").should("have.value", "DTXCID302000003");
    cy.get("#substanceID").should("have.value", "DTXSID502000000");
    cy.get("#preferredName").should("have.value", "Sample Substance");
    cy.get("#casrn").should("have.value", "1234567-89-5");
    cy.get("#qcLevel").should("have.value", "1");
    cy.get("#source").should("have.value", "1");
    cy.get("#substanceType").should("have.value", "1");
    cy.get("#substanceDescription").should(
      "have.value",
      "This is the description for the test substance"
    );
    cy.get("#privateQCNotes").should("have.value", "Private QC notes");
    cy.get("#publicQCNotes").should("have.value", "Public QC notes");
  });
  it("bad search should alert invalidity", () => {
    cy.get("[data-cy=search-box]").type("compound 47");
    cy.get("[data-cy=search-button]").click();
    cy.get("[data-cy=alert-box]").should("contain", "compound 47 not valid");
  });
  it("logout should provide message to user", () => {
    cy.get("[data-cy=user-dropdown]").click();
    cy.get("[data-cy=logout-button]").click();
    cy.get("[data-cy=alert-box]").should(
      "contain",
      "karyn, you are no longer logged in!"
    );
  });
});
